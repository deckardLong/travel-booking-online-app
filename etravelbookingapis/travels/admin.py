from django.contrib import admin
from django.utils.safestring import mark_safe
from django import forms
from django.urls import path
from django.db.models import Count
from django.template.response import TemplateResponse
from ckeditor_uploader.widgets import CKEditorUploadingWidget
from travels.models import BaseService, Payment, Rating, User, TourService, TransportService, HotelService, Booking, ComboService
# Register your models here.

class MyUserAdmin(admin.ModelAdmin):
    list_display = ['id', 'username', 'email', 'role', 'is_active', 'is_verified']
    list_filter = ['role', 'is_verified']
    search_fields = ['username', 'email']
    actions = ['verify_providers']

    @admin.action(description='Phê duyệt các nhà cung cấp đã chọn')
    def verify_providers(self, request, queryset):
        updated = queryset.filter(role='PROVIDER').update(is_verified=True)
        self.message_user(request, f'Đã phê duyệt {updated} nhà cung cấp thành công!')


class TourInline(admin.StackedInline):
    model = TourService
    extra = 0

class HotelInline(admin.StackedInline):
    model = HotelService
    extra = 0

class TransportInline(admin.StackedInline):
    model = TransportService
    extra = 0

class BaseServiceForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditorUploadingWidget) 
    
    class Meta:
        model = BaseService
        fields = '__all__'

class MyBaseServiceAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'provider', 'get_type', 'active', 'created_date']
    list_filter = ['active', 'created_date']
    search_fields = ['name', 'provider__username']
    inlines = [TourInline, HotelInline, TransportInline]
    readonly_fields = ['image_view']
    form = BaseServiceForm

    def image_view(self, service):
        if service.image:
            return mark_safe(f'<img src="{service.image.url}" width="150" />')
        return None
    
    def get_type(self, object):
        if hasattr(object, 'tourservice'):
            return 'Tour'
        if hasattr(object, 'hotelservice'):
            return 'Hotel'
        if hasattr(object, 'transportservice'):
            return 'Transport'
        if hasattr(object, 'comboservice'):
            return 'Combo'
        return 'Base'
    get_type.short_description = 'Loại dịch vụ'

    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if request.user.is_superuser:
            return queryset
        return queryset.filter(provider=request.user)

class MyTourAdmin(admin.ModelAdmin):
    list_display = ['name', 'start_date', 'end_date', 'available_slots', 'price']

class MyHotelAdmin(admin.ModelAdmin):
    list_display = ['name', 'address', 'price']

class MyTransportAdmin(admin.ModelAdmin):
    list_display = ['name', 'vehicle_type', 'departure_time', 'price']

class MyComboServiceAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'get_tour', 'get_hotel', 'get_transport', 'provider']
    list_filter = ['active', 'provider']
    search_fields = ['name']

    def get_tour(self, object):
        if object.tour:
            return object.tour.name
        return '-'
    get_tour.short_description = 'Tour đi kèm'

    def get_hotel(self, object):
        if object.hotel:
            return object.hotel.name
        return '-'
    get_hotel.short_description = 'Khách sạn'

    def get_transport(self, object):
        if object.transport:
            return object.transport.name
        return '-'
    get_transport.short_description = 'Phương tiện'


class MyRatingAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'service', 'score', 'created_date']
    list_filter = ['score', 'created_date']
    readonly_fields = ['customer', 'service', 'score', 'comment']

class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 0

class MyBookingAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'service', 'quantity', 'total_amount', 'status', 'created_date']
    list_filter = ['status', 'created_date']
    inlines = [PaymentInline]
    readonly_fields = ['total_amount', 'unit_price']


class MyAdminSite(admin.AdminSite):
    site_header = 'eTravelApp'

    def get_urls(self):
        return [
            path('service-stats/', self.service_stats)
        ] + super().get_urls()
    
    def service_stats(self, request):
        total_active = BaseService.objects.filter(active=True).count()

        service_stats = BaseService.objects.annotate(
             booking_count=Count('booking')
        ).values('id', 'name', 'booking_count')

        type_counts = {
            'tours': TourService.objects.count(),
            'hotels': HotelService.objects.count(),
            'transports': TransportService.objects.count(),
        }

        return TemplateResponse(request, 'admin/service-stats.html', {
            'total_active': total_active,
            'service_stats': service_stats,
            'type_counts': type_counts,
            'title': 'Thống Kê Dịch Vụ'
        })


admin_site = MyAdminSite(name='etravel')

admin_site.register(User, MyUserAdmin)
admin_site.register(BaseService, MyBaseServiceAdmin)
admin_site.register(TourService, MyTourAdmin)
admin_site.register(HotelService, MyHotelAdmin)
admin_site.register(TransportService, MyTransportAdmin)
admin_site.register(ComboService, MyComboServiceAdmin)
admin_site.register(Rating, MyRatingAdmin)
admin_site.register(Booking, MyBookingAdmin)