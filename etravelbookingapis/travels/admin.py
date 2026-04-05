from django.contrib import admin
from django.utils.safestring import mark_safe
from travels.models import BaseService, Payment, Rating, User, TourService, TransportService, HotelService, Booking
# Register your models here.

class MyUserAdmin(admin.ModelAdmin):
    list_display = ['id', 'username', 'email', 'role', 'is_active', 'is_verified']
    list_filter = ['role', 'is_verified']
    search_fields = ['username', 'email']
    actions = ['verify_providers']

    @admin.action(description='Phê duyệt các nhà cung cấp đã chọn')
    def verify_providers(self, request, queryset):
        queryset.update(is_verified=True)

class TourInline(admin.StackedInline):
    model = TourService
    extra = 0

class HotelInline(admin.StackedInline):
    model = HotelService
    extra = 0

class TransportInline(admin.StackedInline):
    model = TransportService
    extra = 0

class MyBaseServiceAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'price', 'provider', 'active', 'created_date']
    list_filter = ['active', 'created_date']
    search_fields = ['name', 'provider__username']
    inlines = [TourInline, HotelInline, TransportInline]
    readonly_fields = ['image_view']

    def image_view(self, service):
        if service.image:
            return mark_safe(f'<img src="{service.image.url}" width="150" />')
        return None

class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 0

class MyBookingAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer', 'service', 'quantity', 'total_amount', 'status', 'created_date']
    list_filter = ['status', 'created_date']
    inlines = [PaymentInline]
    readonly_fields = ['total_amount', 'unit_price']

admin.site.register(User, MyUserAdmin)
admin.site.register(BaseService, MyBaseServiceAdmin)
admin.site.register(Booking, MyBookingAdmin)