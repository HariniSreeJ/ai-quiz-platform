import axios from 'axios';

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
});

api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 (Unauthorized), token expired, and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh') : null;
                
                if (refreshToken) {
                    // Call the refresh endpoint
                    const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/users/token/refresh/`, {
                        refresh: refreshToken
                    });

                    const newAccessToken = res.data.access;
                    
                    // Update local storage with new access token
                    if (typeof window !== 'undefined') {
                        localStorage.setItem('access', newAccessToken);
                    }

                    // Update the authorization header for future requests
                    api.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
                    
                    // Update the authorization header for the original failed request
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    
                    // Retry the original request
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // If the refresh token is also invalid/expired, log out the user
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('access');
                    localStorage.removeItem('refresh');
                    // Redirect to login page
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;
