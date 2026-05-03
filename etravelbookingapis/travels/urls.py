from travels import views
from rest_framework.routers import DefaultRouter
from django.urls import path, include

router = DefaultRouter()

router.register('users', views.UserViewSet, 'user')
router.register('admin-stats', views.AdminStatsViewSet, 'admin-stats')
router.register('tours', views.TourServiceViewSet, 'tour')
router.register('hotels', views.HotelServiceViewSet, 'hotel')
router.register('transports', views.TransportServiceViewSet, 'transport')
router.register('combos', views.ComboServiceViewSet, 'combo')
router.register('bookings', views.BookingViewSet, 'booking')
router.register('ratings', views.RatingViewSet, 'rating')
router.register('admin-providers', views.AdminProviderViewSet, 'admin-provider')
router.register('admin-reports', views.AdminReportViewSet, 'admin-report')
router.register('customer-reports', views.ReportViewSet, 'customer-report')
router.register('provider-reports', views.ProviderReportViewSet, 'provider-report')

urlpatterns = [
    path('', include(router.urls)),
] 