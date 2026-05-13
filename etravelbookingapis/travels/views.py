from django.shortcuts import render
from travels.models import User, BaseService, TourService, HotelService, TransportService, ComboService, Booking, Rating, Payment, Report
from rest_framework import viewsets, parsers, permissions, status, mixins
from travels import serializers, paginations
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import generics, filters
from django_filters import FilterSet, NumberFilter, CharFilter, DateFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied
from django.db.models import Avg, Sum, Count, Q, F
from django.db.models.functions import ExtractMonth
from datetime import timedelta
from django.utils import timezone
from decimal import Decimal
from django.utils.decorators import method_decorator
from django.views.decorators.debug import sensitive_post_parameters
from oauth2_provider.views.base import TokenView
from etravelbookingapis import settings
import time
# Create your views here.

class AdminProviderViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAdminUser]

    @action(methods=['get'], detail=False)
    def pending(self, request):
        pending_users = User.objects.filter(role='PROVIDER', is_verified=False)
        serializer = serializers.UserSerializer(pending_users, many=True)
        return Response(serializer.data)
    
    @action(methods=['patch'], detail=True)
    def approve(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk, role='PROVIDER')
            user.is_verified = True
            user.save()
            return Response({'message': 'Đã duyệt thành công!'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Không tìm thấy Provider!'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(methods=['delete'], detail=True)
    def reject(self, request, pk=None):
        try:
            user = User.objects.get(pk=pk, role='PROVIDER', is_verified=False)
            user.delete() 
            return Response({'message': 'Đã từ chối và xóa yêu cầu đăng ký!'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'Không tìm thấy Provider hoặc User đã được duyệt trước đó!'}, status=status.HTTP_404_NOT_FOUND)

class IsProvider(permissions.BasePermission):
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and 
            request.user.role == 'PROVIDER' and
            getattr(request.user, 'is_verified', False)
        )

class LoginView(TokenView):
    @method_decorator(sensitive_post_parameters('password'))
    def post(self, request, *args, **kwargs):
        mutable_data = request.POST.copy()

        mutable_data['client_id'] = settings.CLIENT_ID
        mutable_data['client_secret'] = settings.CLIENT_SECRET
        mutable_data['grant_type'] = 'password'
        
        request.POST = mutable_data
        return super().post(request, *args, **kwargs)

class UserViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser, parsers.JSONParser]

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.AllowAny()]
        if self.action == 'list':
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]

    @action(methods=['get', 'patch'], detail=False, url_path='current_user', permission_classes=[permissions.IsAuthenticated()])    
    def current_user(self, request):
        user = request.user
        if request.method == 'PATCH':
            serializer = serializers.UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = serializers.UserSerializer(user)
        return Response(serializer.data)
    
    @action(methods=['patch'], detail=True, url_path='verify')
    def verify(self, request, pk=None):
        user_to_verify = self.get_object()
        if user_to_verify.role != 'PROVIDER':
            return Response({'detail': 'Chỉ có thể duyệt tài khoản nhà cung cấp'}, status=status.HTTP_400_BAD_REQUEST)
        
        user_to_verify.is_verified = True
        user_to_verify.save()

        return Response({'message': f'Tài khoản {user_to_verify.name} đã được duyệt thành công!'}, status=status.HTTP_200_OK)

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.provider == request.user

class ServiceFilter(FilterSet):
    min_price = NumberFilter(field_name='price', lookup_expr='gte')
    max_price = NumberFilter(field_name='price', lookup_expr='lte')
    location = CharFilter(field_name='location', lookup_expr='icontains')
    start_date = DateFilter(field_name="created_date", lookup_expr='gte')

    class Meta:
        model = BaseService
        fields = ['min_price', 'max_price', 'location', 'start_date']

class AdminReportViewSet(mixins.ListModelMixin, 
                         mixins.UpdateModelMixin, 
                         viewsets.GenericViewSet):
    
    queryset = Report.objects.all().order_by('-created_date')
    serializer_class = serializers.ReportSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        query = self.queryset
        status_param = self.request.query_params.get('status')
        if status_param:
            query = query.filter(status=status_param)
        return query

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        new_status = request.data.get('status')
        
        valid_statuses = ['RESOLVED', 'DISMISSED', 'PENDING']
        
        if new_status in valid_statuses:
            instance.status = new_status
            instance.save()
            return Response(serializers.ReportSerializer(instance).data)
        
        return Response(
            {"error": "Trạng thái không hợp lệ hoặc không được phép!"}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
class AdminStatsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAdminUser]

    def list(self, request):
        now = timezone.now()
        current_year = now.year
        last_week = now - timedelta(days=7)
        total_services = BaseService.objects.filter(active=True).count()
        total_revenue_query = Payment.objects.filter(status='COMPLETED').aggregate(Sum('amount'))
        total_system_revenue = total_revenue_query['amount__sum'] or 0
        booking_frequency = Booking.objects.filter(created_date__gte=last_week).count()
        total_users = User.objects.filter(is_active=True).count()

        report_stats = {
            'total': Report.objects.count(),
            'pending': Report.objects.filter(status='PENDING').count(),
            'resolved': Report.objects.filter(status='RESOLVED').count(),
        }

        monthly_revenue_qs = Payment.objects.filter(
            status='COMPLETED',
            created_date__year=current_year # Chỉ lấy năm nay
        ).annotate(
            month=ExtractMonth('created_date')
        ).values('month').annotate(
            revenue=Sum('amount')
        ).order_by('month')

        monthly_chart = list(monthly_revenue_qs)
        top_services_qs = BaseService.objects.filter(
            booking__payment__status='COMPLETED'
        ).annotate(
            total_bookings=Count('booking', distinct=True),
            total_revenue=Sum('booking__payment__amount')
        ).filter(total_revenue__gt=0).order_by('-total_revenue')[:5]

        service_summary = [
            {
                "name": service.name, 
                "total_bookings": service.total_bookings,
                "total_revenue": service.total_revenue
            }
            for service in top_services_qs
        ]

        return Response({
            'total_active_services': total_services,
            'total_system_revenue': total_system_revenue,
            'booking_last_7_days': booking_frequency,
            'reports': report_stats,
            'total_users': total_users,
            'service_distribution': {
                'tours': TourService.objects.count(),
                'hotels': HotelService.objects.count(),
                'transports': TransportService.objects.count(),
                'combos': ComboService.objects.count(),
            },
            'monthly_chart': monthly_chart,
            'service_summary': service_summary
        })


class BaseServiceViewSet(viewsets.ViewSet, viewsets.GenericViewSet, mixins.UpdateModelMixin, mixins.DestroyModelMixin, mixins.CreateModelMixin, mixins.ListModelMixin):
    pagination_class = paginations.ServicePagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ServiceFilter
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    search_fields = ['name', 'description', 'location']
    ordering_fields = ['price', 'avg_rating', 'view_count']
    ordering = ['-view_count', '-created_date']

    def create(self, request, *args, **kwargs):
        print("DỮ LIỆU FRONTEND GỬI LÊN:", request.data) # Xem mảng tour, hotel gửi lên có đúng không
        return super().create(request, *args, **kwargs)

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
            
        if self.action == 'create':
            return [IsProvider()]
            
        if self.action in ['update', 'partial_update', 'destroy']:
            if self.request.user.is_authenticated and getattr(self.request.user, 'role', '') == 'ADMIN':
                return [permissions.IsAuthenticated()]
            return [IsProvider(), IsOwnerOrReadOnly()]
            
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        query = self.queryset.annotate(avg_rating=Avg('rating__score'))

        if not self.request.user.is_authenticated:
            return query.filter(active=True)
    
        if self.request.user.role == 'PROVIDER':
            return query.filter(provider=self.request.user)
 
        if self.request.user.role == 'ADMIN':
            return query
        return query.filter(active=True)
    
    def perform_create(self, serializer):
        if not getattr(self.request.user, 'is_verified', False):
            raise PermissionDenied('Tài khoản nhà cung cấp chưa được xác minh!')
        serializer.save(provider=self.request.user)
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()

        if request.user != instance.provider:
            instance.view_count = F('view_count') + 1
            instance.save()
        instance.refresh_from_db()

        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(methods=['get'], detail=True, url_path='bookings')
    def get_bookings(self, request, pk=None):
        service = self.get_object()
        if service.provider != request.user:
            return Response({"detail": "Bạn không có quyền xem danh sách này!"}, status=status.HTTP_403_FORBIDDEN)
        
        bookings = service.booking_set.all()
        serializer = serializers.BookingSerializer(bookings, many=True)
        return Response(serializer.data)
    
    @action(methods=['get'], detail=True, url_path='all-ratings')
    def get_all_ratings(self, request, pk=None):
        service = self.get_object()
        ratings = service.rating_set.all().order_by('-created_date')
        serializer = serializers.RatingSerializer(ratings, many=True)
        return Response(serializer.data)
    
    @action(methods=['post'], detail=True, url_path='book')
    def book(self, request, pk=None):
        service = self.get_object()
        quantity = int(request.data.get('quantity', 1))
        unit_price = getattr(service, 'price', 0)
        total_amount = quantity * unit_price

        booking = Booking.objects.create(
            customer=request.user,
            service=service,
            quantity=quantity,
            unit_price=unit_price,
            total_amount=total_amount,
            status='PENDING',
        )
        return Response(serializers.BookingSerializer(booking).data, status=status.HTTP_201_CREATED)
    
    @action(methods=['get'], detail=False, url_path='compare/(?P<ids>[^/.]+)')
    def compare(self, request):
        ids_raw = request.query_params.get('ids')
        if not ids_raw:
            return Response({'detail': 'Hãy chọn ít nhất 2 dịch vụ để so sánh!'}, status=status.HTTP_400_BAD_REQUEST)
        ids = ids_raw.split(',')
        queryset = self.get_queryset().filter(id__in=ids)
        if queryset.count() < 2:
            return Response({'detail': 'Không tìm thấy đủ dữ liệu để so sánh!'}, status=status.HTTP_400_BAD_REQUEST)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(methods=['post'], detail=True, url_path='rating')
    def rating(self, request, pk=None):
        service = self.get_object()
        score = request.data.get('score', 0)
        comment = request.data.get('comment', '')

        rating_object, created = Rating.objects.update_or_create(
            customer=request.user,
            service=service,
            defaults={'score': score, 'comment': comment},
        )
        return Response(serializers.RatingSerializer(rating_object).data, status=status.HTTP_201_CREATED)
    
    @action(methods=['get'], detail=False, url_path='stats')
    def provider_stats(self, request):
        user = request.user
        queryset = self.get_queryset().filter(provider=user)
        year = request.query_params.get('year', 2024)

        new_bookings_count = Booking.objects.filter(
            service__provider=user,
            status='PENDING'
        ).count()

        service_stats = queryset.annotate(
            total_customers=Count('booking__customer', distinct=True),
            total_bookings=Count('booking'),
            total_revenue=Sum('booking__payment__amount', filter=Q(booking__payment__status='COMPLETED')),
        ).values('id', 'name', 'total_customers', 'total_bookings', 'total_revenue')

        monthly_stats = Booking.objects.filter(
            service__provider=user,
            payment__status='COMPLETED',
            created_date__year=year,
        ).annotate(month=ExtractMonth('created_date')).values('month').annotate(revenue=Sum('payment__amount'), count=Count('id')).order_by('month')

        return Response({
            'count': queryset.count(),
            'new_bookings': new_bookings_count,
            'service_summary': service_stats,
            'monthly_chart': monthly_stats
        })

class TourServiceViewSet(BaseServiceViewSet):
    queryset = TourService.objects.all()
    serializer_class = serializers.TourServiceSerializer

class HotelServiceViewSet(BaseServiceViewSet):
    queryset = HotelService.objects.all()
    serializer_class = serializers.HotelServiceSerializer

class TransportServiceViewSet(BaseServiceViewSet):
    queryset = TransportService.objects.all()
    serializer_class = serializers.TransportServiceSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        vehicle_type = self.request.query_params.get('vehicle_type')

        if vehicle_type:
            queryset = queryset.filter(vehicle_type=vehicle_type)
        return queryset

class ComboServiceViewSet(BaseServiceViewSet):
    queryset = ComboService.objects.all()
    serializer_class = serializers.ComboServiceSerializer

    @action(methods=['post'], detail=True, url_path='book')
    def book(self, request, pk=None):
        combo = self.get_object()
        quantity = int(request.data.get('quantity', 1))

        booking = Booking.objects.create(
            customer=request.user,
            combo=combo,
            quantity=quantity,
            unit_price=getattr(combo, 'price', 0),
            total_amount=getattr(combo, 'price', 0) * quantity,
            status='PENDING',
        )
        return Response(serializers.BookingSerializer(booking).data)   


class BookingViewSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin, mixins.CreateModelMixin, mixins.ListModelMixin):
    queryset = Booking.objects.all()
    serializer_class = serializers.BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        service = serializer.validated_data.get('service')
        adults = serializer.validated_data.get('adult_count', 1)
        children = serializer.validated_data.get('child_count', 0)

        unit_price = service.price
        total = (adults * unit_price) + (children * unit_price * Decimal('0.7'))

        serializer.save(
            customer=self.request.user,
            unit_price=unit_price,
            total_amount=total
        )
    
    @action(methods=['get'], detail=False, url_path='provider_bookings')
    def get_provider_bookings(self, request):
        bookings = Booking.objects.filter(service__provider=request.user).order_by('-created_date')
        serializer = serializers.BookingSerializer(bookings, many=True)
        return Response(serializer.data)

    @action(methods=['post'], detail=True, url_path='pay')
    def pay(self, request, pk=None):
        booking = self.get_object()
        payment_method = request.data.get('method_type')
        amount_to_pay = booking.total_amount or 0

        if booking.status == 'PAID':
            return Response({'detail': 'Dịch vụ này đã thanh toán!'}, status=400)
        
        time.sleep(2)

        Payment.objects.create(
            booking=booking,
            method_type =payment_method,
            amount=amount_to_pay,
            status='COMPLETED',
            transaction_id = f'MOCK-TXN-{int(time.time())}'
        )

        booking.status = 'PAID'
        booking.save()
        return Response({
            'message': f'Thanh toán qua {payment_method} thành công!',
            'transaction_id': f'MOCK-TXN-{int(time.time())}',
            'amount': booking.total_amount,
        }, status=status.HTTP_200_OK)
    
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Booking.objects.filter(customer=user).order_by('-created_date')
        return Booking.objects.none()


class RatingViewSet(viewsets.ViewSet, viewsets.generics.UpdateAPIView, viewsets.generics.ListAPIView):
    queryset = Rating.objects.all()
    serializer_class = serializers.RatingSerializer

    @action(methods=['patch'], detail=True, url_path='reply')
    def reply(self, request, pk=None):
        instance = self.get_object()

        if instance.service.provider != request.user:
            return Response({"detail": "Bạn không có quyền phản hồi đánh giá này!"}, status=status.HTTP_403_FORBIDDEN)
        reply_content = request.data.get('owner_reply')
        if not reply_content:
            return Response({"detail": "Nội dung phản hồi không được trống!"}, status=status.HTTP_400_BAD_REQUEST)
        
        instance.owner_reply = reply_content
        instance.reply_date = timezone.now()
        instance.save()

        return Response(self.serializer_class(instance).data, status=status.HTTP_200_OK)
    
    def get_permissions(self):
        if self.action == 'reply':
            return [IsProvider()]
        return [permissions.AllowAny()]
    
    def get_queryset(self):
        query = super().get_queryset()
        
        if self.request.user.is_authenticated and getattr(self.request.user, 'role', '') == 'PROVIDER':
            return query.filter(service__provider=self.request.user).order_by('-id')      
        return query


class ReportViewSet(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.ListModelMixin):
    serializer_class = serializers.ReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Report.objects.filter(user=self.request.user).order_by('-id')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class ProviderReportViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    serializer_class = serializers.ReportSerializer
    permission_classes = [IsProvider] 

    def get_queryset(self):
        user = self.request.user
        if user.role == 'PROVIDER':
            return Report.objects.filter(service__provider=user).order_by('-created_date')
        return Report.objects.none() 