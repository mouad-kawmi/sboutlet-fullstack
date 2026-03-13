import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const CartDrawer = () => {
    const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, cartTotal } = useCart();
    const navigate = useNavigate();

    if (!isCartOpen) return null;

    return (
        <div className="fixed inset-0 z-[200] overflow-hidden">
            {/* Overlay backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-500"
                onClick={() => setIsCartOpen(false)}
            ></div>

            <div className="absolute inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md bg-white dark:bg-background-dark shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col transform transition-transform duration-500 ease-out border-l border-slate-100 dark:border-slate-800">

                    {/* Header */}
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
                        <div>
                            <h2 className="text-xl font-bold uppercase tracking-tight text-slate-900">Votre Panier</h2>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                                {cartItems.length} {cartItems.length > 1 ? 'Pièces Uniques' : 'Pièce Unique'}
                            </p>
                        </div>
                        <button
                            onClick={() => setIsCartOpen(false)}
                            className="w-10 h-10 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">close</span>
                        </button>
                    </div>

                    {/* Cart Items List */}
                    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white">
                        {cartItems.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center p-10">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                                    <span className="material-symbols-outlined text-4xl text-slate-300">local_mall</span>
                                </div>
                                <h3 className="text-base font-bold text-slate-900 mb-2 uppercase tracking-wide">Panier Vide</h3>
                                <p className="text-slate-500 text-sm mb-8">Votre sélection de luxe vous attend.</p>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-primary transition-colors"
                                >
                                    Découvrir nos pièces
                                </button>
                            </div>
                        ) : (
                            cartItems.map((item) => (
                                <div key={item.id} className="flex gap-5 group relative">
                                    {/* Product Image */}
                                    <div className="w-24 h-32 rounded-xl bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-start">
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.brand}</p>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-slate-300 hover:text-primary transition-colors"
                                                >
                                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                                </button>
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug pr-4">
                                                {item.name}
                                            </h3>
                                        </div>

                                        <div className="flex justify-between items-end mt-2">
                                            <div className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-emerald-500 text-sm">verified</span>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pièce disponible</span>
                                            </div>
                                            <p className="text-base font-black text-primary-700 tracking-tight">
                                                {item.price} DH
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer / Summary */}
                    {cartItems.length > 0 && (
                        <div className="p-8 bg-white border-t border-slate-100 space-y-6">
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-slate-500 text-xs font-medium">
                                    <span>Sous-total</span>
                                    <span className="text-slate-900 font-bold">
                                        {cartTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-slate-500 text-xs font-medium bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                                    <span className="flex items-center gap-2">
                                        <span className="text-lg">💳</span>
                                        <span className="font-bold text-slate-900 uppercase tracking-tighter">Paiement à la livraison uniquement</span>
                                    </span>
                                </div>
                                <div className="h-[1px] bg-slate-100 my-4"></div>
                                <div className="flex justify-between items-end">
                                    <span className="text-slate-900 font-bold uppercase text-xs tracking-wider">Total</span>
                                    <span className="text-2xl font-black text-slate-900 tracking-tight">
                                        {cartTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} DH
                                    </span>
                                </div>
                            </div>

                            <div className="grid gap-3 pt-2">
                                <button
                                    onClick={() => {
                                        setIsCartOpen(false);
                                        navigate('/checkout');
                                    }}
                                    className="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase text-[11px] tracking-widest transition-colors hover:bg-primary/90 flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                                    Commander
                                </button>
                                <button
                                    onClick={() => setIsCartOpen(false)}
                                    className="w-full bg-slate-50 text-slate-600 py-4 rounded-xl font-bold uppercase text-[11px] tracking-widest hover:bg-slate-100 transition-colors"
                                >
                                    Continuer vos achats
                                </button>
                            </div>

                            <div className="flex flex-col items-center gap-3 pt-2">
                                <div className="flex items-center gap-4 bg-slate-50 px-5 py-2.5 rounded-full border border-slate-100">
                                    <span className="text-[10px] text-slate-600 font-black flex items-center gap-1.5 uppercase tracking-widest">
                                        <span className="material-symbols-outlined text-[16px] text-emerald-500">lock</span>
                                        Vérifié
                                    </span>
                                    <div className="w-1 h-3 bg-slate-200"></div>
                                    <span className="text-[10px] text-slate-600 font-black flex items-center gap-1.5 uppercase tracking-widest">
                                        <span className="material-symbols-outlined text-[16px] text-emerald-500">local_shipping</span>
                                        Expédition Rapide
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartDrawer;
