from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone
from cloudinary.models import CloudinaryField
from ckeditor.fields import RichTextField

# Create your models here.
class MyUserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email là bắt buộc!')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('role', 'ADMIN')
        extra_fields.setdefault('is_verified', True)
        return self.create_user(username, email, password, **extra_fields)


class User(AbstractUser):
    ROLE_CHOICES = [
        ('ADMIN', 'admin'),
        ('PROVIDER', 'provider'),
        ('CUSTOMER', 'customer'),
    ]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='CUSTOMER')
    is_verified = models.BooleanField(default=False)
    avatar = CloudinaryField(null=True)
    objects = MyUserManager()


class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(default=timezone.now, editable=False)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class BaseService(BaseModel):
    name = models.CharField(max_length=50, unique=True)
    description = RichTextField(null=True)
    image = CloudinaryField(null=True)
    price = models.DecimalField(max_digits=12, decimal_places=0, default=0, validators=[MinValueValidator(0)])
    location = models.CharField(max_length=50, null=True)
    view_count = models.IntegerField(default=0)

    provider = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('name', 'provider')

    def __str__(self):
        return self.name
    
    @property
    def average_rating(self):
        ratings = self.rating_set().all()
        if ratings.exists():
            return sum(r.score for r in ratings) / ratings.count()
        return 0


class TourService(BaseService):
    start_date = models.DateTimeField(null=True)
    end_date = models.DateTimeField(null=True)
    duration = models.CharField(max_length=50, null=True)
    itinerary = RichTextField(null=True, help_text='Lịch trình chi tiết')
    meeting_point = models.CharField(max_length=255, null=True)
    available_slots = models.IntegerField(default=0)


class HotelService(BaseService):
    star_rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], default=3)
    address = models.CharField(max_length=255, default=None)
    amenities = models.TextField(null=True)
    checkin_time = models.TimeField(null=True)
    checkout_time = models.TimeField(null=True)
    policy = RichTextField(null=True)

class TransportService(BaseService):
    VEHICLE_CHOICES = [
        ('FLIGHT', 'Máy bay'),
        ('BUS', 'Xe khách'),
        ('SHIP', 'Tàu'),
    ]
    vehicle_type = models.CharField(max_length=15, choices=VEHICLE_CHOICES, default='BUS')
    from_location = models.CharField(max_length=100, null=True)
    to_location = models.CharField(max_length=100, null=True) 
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField(null=True)
    seat_capacity = models.IntegerField(validators=[MinValueValidator(1)])                               

class ComboService(BaseService):
    tour = models.ManyToManyField(TourService, blank=True)
    hotel = models.ManyToManyField(HotelService, blank=True)
    transport = models.ManyToManyField(TransportService, blank=True)


class Booking(BaseModel):  
    STATUS_CHOICES = [
        ('PENDING', 'Chờ thanh toán'),
        ('PAID', 'Đã thanh toán'),
        ('CANCELLED', 'Đã hủy'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    quantity = models.IntegerField(validators=[MinValueValidator(0)], default=0)
    unit_price = models.DecimalField(max_digits=12, decimal_places=0, null=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=0, null=True)
    booking_date = models.DateField(null=True, help_text="Ngày nhận phòng/Ngày khởi hành")
    adult_count = models.IntegerField(validators=[MinValueValidator(1)], default=1)
    child_count = models.IntegerField(validators=[MinValueValidator(0)], default=0)

    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    service = models.ForeignKey(BaseService, on_delete=models.PROTECT)



class Payment(BaseModel):
    METHOD_CHOICES = [
        ('CASH', 'Tiền mặt'),
        ('PAYPAL', 'PayPal'),
        ('STRIPE', 'Stripe'), 
        ('MOMO', 'MoMo'),
        ('ZALOPAY', 'ZaloPay'),
    ] 

    STATUS_CHOICES = [
        ('PENDING', 'Đang xử lý'),
        ('COMPLETED', 'Đã thành công'),
        ('FAILED', 'Đã thất bại'),
    ]

    method_type = models.CharField(max_length=10, choices=METHOD_CHOICES, default='CASH')
    amount = models.DecimalField(max_digits=12, decimal_places=0, validators=[MinValueValidator(0)], null=True)
    transaction_id = models.CharField(max_length=255, null=True, blank=True)
    created_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')

    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, default=None)



class Rating(BaseModel):
    score = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)], default=0)
    comment = models.TextField(default=None)
    image = CloudinaryField(null=True)

    customer = models.ForeignKey(User, on_delete=models.CASCADE, default=None)
    service = models.ForeignKey(BaseService, on_delete=models.CASCADE, default=None)

    class Meta:
        unique_together = ('customer', 'service')
