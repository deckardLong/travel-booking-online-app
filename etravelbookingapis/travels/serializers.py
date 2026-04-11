from rest_framework import serializers
from rest_framework.response import Response
from travels.models import User, BaseService, ComboService, TourService, HotelService, TransportService, Booking, Rating, Payment

class UserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'avatar_url']
        extra_kwargs = {
            'password': {'write_only': True}
            }
    
    def get_avatar_url(self, object):
        if object.avatar:
            return object.avatar.url
        return None
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)

        if password:
            user.set_password(validated_data['password'])
        user.save()

        return user
        

class TourServiceSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = TourService
        fields = '__all__'

class HotelServiceSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = HotelService
        fields = '__all__'

class TransportServiceSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = TransportService
        fields = '__all__'

class BaseServiceSerializer(serializers.ModelSerializer):
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

class ComboServiceSerializer(serializers.ModelSerializer):
    tour = serializers.CharField(source='tour.name', read_only=True)
    hotel = serializers.CharField(source='hotel.name', read_only=True)
    transport = serializers.CharField(source='transport.name', read_only=True)

    class Meta:
        model = ComboService
        fields = '__all__'


class RatingSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.username')

    class Meta:
        model = Rating
        fields = ['id', 'score', 'comment', 'image', 'customer', 'customer_name', 'service', 'created_date']
        read_only_fields = ['customer']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ['id', 'method_type', 'amount', 'booking', 'created_date']


class BookingSerializer(serializers.ModelSerializer):
    payment = PaymentSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'status', 'quantity', 'unit_price', 'total_amount', 'customer', 'service', 'payment', 'created_date']
        read_only_fields = ['customer', 'status', 'total_amount', 'unit_price']