import React, { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const addToCart = (product) => {
        setCartItems(prev => {
            const exists = prev.find(item => item.id === product.id);
            if (exists) return prev; // It's a unique piece, already in cart
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => setCartItems([]);

    // newQty = the exact target quantity (not a delta)
    const updateQuantity = (id, newQty) => {
        const qty = Math.max(1, newQty);
        setCartItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity: qty } : item
        ));
    };

    // Parse prices like "1 290 DH" correctly
    const parsePrice = (priceStr) => {
        if (!priceStr) return 0;
        if (typeof priceStr === 'number') return priceStr;
        // Remove currency symbols and spaces, replace comma decimal with dot
        const cleaned = priceStr.toString().replace(/[^\d,\.]/g, '').replace(',', '.');
        return parseFloat(cleaned) || 0;
    };

    const cartTotal = cartItems.reduce(
        (acc, item) => acc + parsePrice(item.price) * item.quantity,
        0
    );

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, isCartOpen, setIsCartOpen }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
