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
    'login': '/o/token/',
    'current-user': '/users/current_user/',
    'update-user': '/users/current_user/',
    'register': '/users/',
    'rating': (type, id) => `/${type}/${id}/rating/`,
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