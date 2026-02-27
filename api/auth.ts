import client from './client';

export const authApi = {
    register: (data: any) => client.post('/auth/register', data),
    login: (data: any) => {
        const formData = new URLSearchParams();
        formData.append('username', data.username);
        formData.append('password', data.password);

        console.log('🌐 Login request details:');
        console.log('  - URL:', client.defaults.baseURL + '/auth/login');
        console.log('  - Username:', data.username);

        return client.post('/auth/login', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }).catch((error: any) => {
            console.error('🚨 Login request failed:');
            console.error('  - Error:', error);
            throw error;
        });
    },
    verifyOtp: (data: any) => client.post('/auth/verify-otp', data),
    getMe: () => client.get('/users/me'),
};
