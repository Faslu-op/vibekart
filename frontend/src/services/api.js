import axios from 'axios';

const api = axios.create({
    baseURL: 'https://vibekart.onrender.com/api',
    timeout: 10000, // 10 second timeout (reduced since cache provides instant fallback)
});

// Retry logic for failed requests
api.interceptors.response.use(
    response => response,
    async error => {
        const config = error.config;
        
        // If request failed and hasn't been retried yet
        if (!config || !config.retry) {
            config.retry = 0;
        }
        
        config.retry += 1;
        
        // Retry up to 3 times for network/timeout errors
        if (config.retry <= 3 && (error.code === 'ECONNABORTED' || error.message.includes('timeout') || error.message.includes('Network Error'))) {
            console.log(`Retrying request... Attempt ${config.retry}/3`);
            
            // Exponential backoff: wait 1s, then 2s, then 4s
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, config.retry - 1)));
            
            return api(config);
        }
        
        return Promise.reject(error);
    }
);

// Add token to requests if available
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});

export const getProducts = () => api.get('/products');
export const getProduct = (id) => api.get(`/products/${id}`);
export const createOrder = (orderData) => api.post('/orders', orderData);
export const loginAdmin = (credentials) => api.post('/auth/login', credentials);
export const addProduct = (productData) => {
    // Check if productData is FormData
    if (productData instanceof FormData) {
        return api.post('/products', productData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
    return api.post('/products', productData);
};
export const updateProduct = (id, productData) => {
    if (productData instanceof FormData) {
        return api.put(`/products/${id}`, productData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
    return api.put(`/products/${id}`, productData);
};
export const deleteProduct = (id) => api.delete(`/products/${id}`);
export const getOrders = () => api.get('/orders');
export const updateOrderStatus = (id, status) => api.put(`/orders/${id}/status`, { status });
export const deleteOrder = (id) => api.delete(`/orders/${id}`);

// Category Services
export const getCategories = () => api.get('/categories');
export const syncCategories = () => api.post('/categories/sync');
export const reorderCategories = (categories) => api.put('/categories/reorder', { categories });

export default api;
