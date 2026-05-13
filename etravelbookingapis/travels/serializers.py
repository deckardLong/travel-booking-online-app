from rest_framework import serializers
from rest_framework.response import Response
from travels.models import User, BaseService, ComboService, TourService, HotelService, TransportService, Booking, Rating, Payment, Report
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'role', 'password', 'avatar', 'is_verified', 'is_active']
        extra_kwargs = {
            'password': {'write_only': True}
            }
    
    def create(self, validated_data):
        user = User(**validated_data)

        user.set_password(validated_data['password'])

        if user.role == 'CUSTOMER':
            user.is_verified = True
        else:
            user.is_verified = False

        user.save()
        return user
        

class ServiceImageMixin:
    def get_image_url(self, instance):
        if instance.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(instance.image.url)
            return instance.image.url
        return None

class BaseServiceSerializer(ServiceImageMixin, serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    service_type = serializers.SerializerMethodField()

    class Meta:
        model = BaseService
        fields = ['id', 'name', 'price', 'image_url', 'service_type', 'active']
    
    def get_image_url(self, instance):
        if instance.image:
            return instance.image.url
        
        return None
    
    def get_service_type(self, object):
        if hasattr(object, 'tourservice'):
            return 'tour'
        if hasattr(object, 'hotelservice'):
            return 'hotel'
        if hasattr(object, 'transportservice'):
            return 'transport'
        return 'base'

class TourServiceSerializer(ServiceImageMixin, serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    provider_name = serializers.CharField(source='provider.username', read_only=True)
    provider_avatar = serializers.SerializerMethodField()

    class Meta:
        model = TourService
        fields = '__all__'
        read_only_fields = ['provider']
    
    def get_provider_avatar(self, obj):
        if obj.provider and obj.provider.avatar:
            return str(obj.provider.avatar)
        return None

class HotelServiceSerializer(ServiceImageMixin, serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    provider_name = serializers.CharField(source='provider.username', read_only=True)
    provider_avatar = serializers.SerializerMethodField()

    class Meta:
        model = HotelService
        fields = '__all__'
        read_only_fields = ['provider']
    
    def get_provider_avatar(self, obj):
        if obj.provider and obj.provider.avatar:
            return str(obj.provider.avatar)
        return None

class TransportServiceSerializer(ServiceImageMixin, serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    provider_name = serializers.CharField(source='provider.username', read_only=True)
    provider_avatar = serializers.SerializerMethodField()

    class Meta:
        model = TransportService
        fields = '__all__'
        read_only_fields = ['provider']
    
    def get_provider_avatar(self, obj):
        if obj.provider and obj.provider.avatar:
            return str(obj.provider.avatar)
        return None

class ComboServiceSerializer(serializers.ModelSerializer):
    tour = serializers.PrimaryKeyRelatedField(many=True, queryset=TourService.objects.all(), required=False)
    hotel = serializers.PrimaryKeyRelatedField(many=True, queryset=HotelService.objects.all(), required=False)
    transport = serializers.PrimaryKeyRelatedField(many=True, queryset=TransportService.objects.all(), required=False)
    provider_name = serializers.CharField(source='provider.username', read_only=True)
    provider_avatar = serializers.SerializerMethodField()

    class Meta:
        model = ComboService
        fields = '__all__'
        extra_kwargs = {
            'provider': {'read_only': True}
        }
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        
        representation['tour'] = TourServiceSerializer(instance.tour.all(), many=True).data
        representation['hotel'] = HotelServiceSerializer(instance.hotel.all(), many=True).data
        representation['transport'] = TransportServiceSerializer(instance.transport.all(), many=True).data
        
        return representation
    
    def get_provider_avatar(self, obj):
        if obj.provider and obj.provider.avatar:
            return str(obj.provider.avatar)
        return None


class RatingSerializer(serializers.ModelSerializer):
    customer_name = serializers.SerializerMethodField()
    customer_avatar = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Rating
        fields = ['id', 'score', 'comment', 'image', 'customer', 'customer_name', 'customer_avatar', 'service', 'created_date', 'owner_reply', 'reply_date']
        read_only_fields = ['customer']
    
    def get_image(self, rating):
        if rating.image:
            return rating.image.url 
        return None
    
    def get_customer_avatar(self, rating):
        if rating.customer and rating.customer.avatar:
            return rating.customer.avatar.url
        return None
    
    def get_customer_name(self, rating):
        if rating.customer:
            full_name = f"{rating.customer.first_name} {rating.customer.last_name}".strip()
            return full_name if full_name else rating.customer.username
        return "Khách hàng ẩn danh"


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'method_type', 'amount', 'booking', 'created_date']


class BookingSerializer(serializers.ModelSerializer):
    payment = PaymentSerializer(read_only=True)
    service_name = serializers.ReadOnlyField(source='service.name')
    customer_username = serializers.ReadOnlyField(source='customer.username')

    class Meta:
        model = Booking
        fields = ['id', 'payment', 'customer', 'service', 'service_name', 'booking_date', 'adult_count', 'child_count', 'unit_price', 'total_amount', 'status', 'customer_username']
        read_only_fields = ['customer', 'status', 'total_amount', 'unit_price']


class ReportSerializer(serializers.ModelSerializer):
    reason_display = serializers.CharField(source='get_reason_display', read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    class Meta:
        model = Report
        fields = '__all__'