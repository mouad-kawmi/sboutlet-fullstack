import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const normalizeProduct = (p) => {
        const baseUrl = process.env.REACT_APP_IMAGE_URL || 'http://localhost:8000/storage';

        const fixPath = (path) => {
            if (!path) return '';
            if (path.startsWith('http')) return path;
            return `${baseUrl}/${path.replace(/\\/g, '/')}`;
        };

        return {
            ...p,
            image: fixPath(p.main_image),
            images: p.images ? p.images.map(img => {
                const url = typeof img === 'string' ? img : img.image_url;
                return fixPath(url);
            }) : [],
            condition: p.condition_status,
            oldPrice: p.old_price,
            details: p.details,
            design: p.design,
            size: p.size,
        };
    };

    const [pagination, setPagination] = useState(null);

    // Fetch products and orders
    const fetchData = async () => {
        setLoading(true);

        // Fetch all products for storefront (price filters, etc.)
        try {
            // Use ?all=true to get everything for storefront logic
            const productsRes = await api.get('/products?in_stock=true&all=true');
            const normalizedProducts = productsRes.data.map(normalizeProduct);
            setProducts(normalizedProducts);
        } catch (error) {
            console.error("Error fetching products:", error);
        }

        // Fetch first page for Admin (so it's paginated by default)
        try {
            const paginateRes = await api.get('/products?in_stock=false'); // in_stock=false gets all? No, Laravel index filters in_stock=true by default. I should pass ?in_stock=false to see everything in Admin.
            setPagination(paginateRes.data);
        } catch (error) {
            console.error("Error fetching paginated products:", error);
        }

        // Only try to fetch orders if we have a token (likely admin or logged user)
        const token = localStorage.getItem('sboutlet_token');
        if (token) {
            try {
                const ordersRes = await api.get('/orders');
                const normalizedOrders = ordersRes.data.map(o => ({
                    ...o,
                    customer: o.customer_name,
                    phone: o.customer_phone,
                    city: o.customer_city,
                    address: o.customer_address,
                    items: o.items.map(item => ({
                        ...item,
                        name: item.product?.name || 'Produit inconnu',
                        qty: item.quantity,
                        price: item.price
                    }))
                }));
                setOrders(normalizedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Polling: Refresh orders every 30 seconds for real-time updates
    useEffect(() => {
        const token = localStorage.getItem('sboutlet_token');
        if (!token) return;

        const interval = setInterval(() => {
            fetchOrdersOnly();
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, []);

    // Fetch orders only (lightweight refresh)
    const fetchOrdersOnly = async () => {
        const token = localStorage.getItem('sboutlet_token');
        if (!token) return;
        
        try {
            const ordersRes = await api.get('/orders');
            const normalizedOrders = ordersRes.data.map(o => ({
                ...o,
                customer: o.customer_name,
                phone: o.customer_phone,
                city: o.customer_city,
                address: o.customer_address,
                items: o.items.map(item => ({
                    ...item,
                    name: item.product?.name || 'Produit inconnu',
                    qty: item.quantity,
                    price: item.price
                }))
            }));
            setOrders(normalizedOrders);
        } catch (error) {
            console.error("Error polling orders:", error);
        }
    };

    // Products CRUD using FormData for Images
    const addProduct = async (formData) => {
        try {
            const response = await api.post('/products', formData);
            setProducts(prev => [...prev, normalizeProduct(response.data)]);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Erreur lors de l\'ajout.' };
        }
    };

    const updateProduct = async (id, formData) => {
        try {
            // Laravel PUT with files sometimes needs _method: 'PUT' in a POST request
            formData.append('_method', 'PUT');
            const response = await api.post(`/products/${id}`, formData);
            const updated = normalizeProduct(response.data);

            setProducts(prev => prev.map(p => p.id === id ? updated : p));
            setPagination(prev => {
                if (!prev || !prev.data) return prev;
                return {
                    ...prev,
                    data: prev.data.map(p => p.id === id ? updated : p)
                };
            });

            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Erreur lors de la modification.' };
        }
    };

    const deleteProduct = async (id) => {
        try {
            await api.delete(`/products/${id}`);
            setProducts(prev => prev.filter(p => p.id !== id));
            setPagination(prev => {
                if (!prev || !prev.data) return prev;
                return {
                    ...prev,
                    data: prev.data.filter(p => p.id !== id),
                    total: (prev.total || 1) - 1
                };
            });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Erreur lors de la suppression.' };
        }
    };

    // Customer Place Order
    const placeOrder = async (orderData) => {
        try {
            const response = await api.post('/orders', orderData);
            // If admin is logged in, append to orders list
            setOrders(prev => [response.data.order, ...prev]);
            return { success: true, order: response.data.order };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Erreur lors de la commande.' };
        }
    };

    // Paginated fetch for specific pages (Admin or Storefront)
    const fetchProductsPage = async (page = 1, extraParams = {}) => {
        try {
            const res = await api.get('/products', { params: { page, ...extraParams } });
            // Normalize the data inside the pagination object
            const paginatedData = {
                ...res.data,
                data: res.data.data.map(normalizeProduct)
            };
            setPagination(paginatedData);
            return paginatedData;
        } catch (error) {
            console.error("Error fetching page:", error);
            return null;
        }
    };

    const updateOrderStatus = async (id, status) => {
        try {
            const response = await api.patch(`/orders/${id}/status`, { status });
            setOrders(prev => prev.map(o => o.id === id ? { ...o, status: response.data.order.status } : o));
            await fetchData(); // Refresh products to reflect stock changes
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.message || 'Erreur lors de la mise à jour.' };
        }
    };

    // Stats calculated from fetched data
    const stats = {
        totalRevenue: orders.filter(o => o.status === 'Livré').reduce((a, o) => a + Number(o.total), 0),
        pendingOrders: orders.filter(o => o.status === 'En attente').length,
        totalProducts: products.length,
        totalOrders: orders.length
    };

    const availableProducts = products.filter(p => p.stock > 0);

    return (
        <AdminContext.Provider value={{
            products,
            availableProducts,
            pagination,
            fetchProductsPage,
            orders,
            updateOrderStatus,
            placeOrder,
            stats,
            loading,
            refreshData: fetchData,
            addProduct,
            updateProduct,
            deleteProduct
        }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);
