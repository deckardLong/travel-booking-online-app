import axios from "axios";

const HOST = 'http://10.0.2.2:8000';

export const endpoints = {
    'tours': '/tours/',
    'hotels': '/hotels/',
    'transports': '/transports/',
    'combos': '/combos/',
    'bookings': '/bookings/',
    'my-bookings': '/bookings/',
    'pay': (bookingId) => `/bookings/${bookingId}/pay/`,
    'login': '/mobile-login/',
    'current-user': '/users/current_user/',
    'update-user': '/users/current_user/',
    'provider-bookings': '/bookings/provider_bookings/',
    'register': '/users/',
    'rating': (type, id) => `/${type}/${id}/rating/`,
    'compare': (type) => `/${type}/compare/`,
    'stats': (type) => `/${type}/stats/`,
    'create': (type) => `/${type}/`,
    'ratings': '/ratings/',
    'pending-providers': '/admin-providers/pending/',
    'approve-providers': (id) => `/admin-providers/${id}/approve/`,
    'reject-provider': (id) => `/admin-providers/${id}/reject/`,
    'admin-stats': '/admin-stats/',
    'report-detail': (id) => `/admin-reports/${id}/`,
    'reports' : `/admin-reports/`,
    'users': '/users/',
    'services': (type) => `/${type}/`,
    'customer-report': '/customer-reports/',
    'provder-report': '/provider-reports/'
};

export default axios.create({
    baseURL: HOST
});

export const authApi = (token) => {
    return axios.create({
        baseURL: HOST,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });   
};