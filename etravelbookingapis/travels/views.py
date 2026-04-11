from django.shortcuts import render
from travels.models import User, BaseService, TourService, HotelService, TransportService, ComboService, Booking, Rating, Payment
from rest_framework import viewsets, parsers, permissions, status, mixins
from travels import serializers, paginations
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import generics, filters
from django_filters import FilterSet, NumberFilter, CharFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.exceptions import PermissionDenied
from django.db.models import Avg, Sum, Count, Q
from django.db.models.functions import ExtractMonth
from datetime import timedelta
from django.utils import timezone
import time
# Create your views here.

class IsProvider(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'PROVIDER'

class UserViewSet(viewsets.GenericViewSet, mixins.ListModelMixin, mixins.RetrieveModelMixin, mixins.CreateModelMixin):
    queryset = User.objects.filter(is_active=True)
    serializer_class = serializers.UserSerializer
    parser_classes = [parsers.MultiPartParser]

    def get_permissions(self):
        if self.action in ['create']:
            return [permissions.AllowAny()]
        if self.action == 'list':
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]

    @action(methods=['get'], detail=False, url_path='current_user')    
    def current_user(self, request):
        return Response(serializers.UserSerializer(request.user).data)
    
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

    class Meta:
        model = BaseService
        fields = ['min_price', 'max_price', 'location']

class AdminStatsViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAdminUser]

    def list(self, request):
        total_services = BaseService.objects.filter(active=True).count()
        total_revenue = Payment.objects.filter(status='COMPLETED').aggregate(Sum('amount'))
        last_week = timezone.now() - timedelta(days=7)
        booking_frequency = Booking.objects.filter(created_date__gte=last_week).count()

        return Response({
            'total_active_services': total_services,
            'total_system_revenue': total_revenue['amount__sum'] or 0,
            'booking_last_7_days': booking_frequency,
            'service_distribution': {
                'tours': TourService.objects.count(),
                'hotels': HotelService.objects.count(),
                'transports': TransportService.objects.count()
            }
        })

class BaseServiceViewSet(viewsets.ViewSet, viewsets.GenericViewSet, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    pagination_class = paginations.ServicePagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = ServiceFilter

    search_fields = ['name', 'description', 'location']
    ordering_fields = ['price', 'created_date', 'view_count']
    ordering = ['-view_count', '-created_date']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        if self.action == 'create':
            return [IsProvider()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsProvider(), IsOwnerOrReadOnly()]
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        query = self.queryset.filter(active=True)
        if self.request.user.is_authenticated and self.request.user.role == 'PROVIDER':
            return self.queryset.filter(provider=self.request.user)
        return query
    
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
        if service.provider != service.user:
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
    
    @action(methods=['get'], detail=False, url_path='compare')
    def compare(self, request):
        ids_raw = request.query_params.get('ids')
        if not ids_raw:
            return Response({'detail': 'Hãy chọn ít nhất 2 dịch vụ để so sánh!'})
        ids = ids_raw.split(',')
        queryset = self.get_queryset().filter(id__in=ids).annotate(
            avg_rating=Avg('rating__score')
        ) 
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

        service_stats = queryset.annotate(
            total_customers=Count('booking__user', distinct=True),
            total_bookings=Count('booking'),
            total_revenue=Sum('booking__payment__amount', filter=Q(booking__payment__status='COMPLETED')),
        ).values('id', 'name', 'total_customers', 'total_bookings', 'total_revenue')

        monthly_stats = Booking.objects.filter(
            service__provider=user,
            payment__status='COMPLETED',
            created_date__year=year,
        ).annotate(month=ExtractMonth('created_date')).values('month').annotate(revenue=Sum('payment__amount'), count=Count('id')).order_by('month')

        return Response({
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


class BookingViewSet(viewsets.ViewSet, viewsets.GenericViewSet):
    @action(methods=['post'], detail=True, url_path='pay')
    def pay(self, request, pk=None):
        booking = self.get_object()
        payment_method = request.data.get('method')

        if booking.status == 'PAID':
            return Response({'detail': 'Dịch vụ này đã thanh toán!'}, status=400)
        
        time.sleep(2)

        Payment.objects.create(
            booking=booking,
            method=payment_method,
            amount=booking.total_amount,
            transaction_id = f'MOCK-TXN-{int(time.time())}'
        )

        booking.status = 'PAID'
        booking.save()
        return Response({
            'message': f'Thanh toán qua {payment_method} thành công!',
            'transaction_id': f'MOCK-TXN-{int(time.time())}',
            'amount': booking.total_amount,
        }, status=status.HTTP_200_OK)
