import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { placeOrder } = useAdmin();
    const navigate = useNavigate();
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        city: '',
        address: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const orderData = {
            customer_name: formData.fullName,
            customer_phone: formData.phone,
            customer_city: formData.city,
            customer_address: formData.address,
            items: cartItems.map(item => ({
                product_id: item.id,
                quantity: item.quantity
            })),
        };

        const result = await placeOrder(orderData);

        if (result.success) {
            clearCart();
            setSuccess(true);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-24 text-center">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-outlined text-4xl">check_circle</span>
                </div>
                <h2 className="text-3xl font-black mb-4 uppercase tracking-tight text-slate-900">Commande Confirmée !</h2>
                <p className="text-slate-500 mb-8 max-w-lg mx-auto">
                    Merci pour votre achat. Nous avons bien reçu votre commande et nous vous contacterons très prochainement par téléphone ({formData.phone}) pour organiser la livraison.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="bg-primary hover:bg-primary-600 text-white font-bold uppercase tracking-widest px-8 py-4 rounded-full shadow-lg transition-all active:scale-95"
                >
                    Continuer mes achats
                </button>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4">Votre panier est vide</h2>
                <button onClick={() => navigate('/')} className="text-primary font-bold underline">Retour à l'accueil</button>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Checkout Form */}
                    <div className="flex-1">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                            <h2 className="text-xl font-bold uppercase tracking-tight mb-8">Informations de livraison</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2 tracking-widest">Nom complet</label>
                                        <input
                                            required
                                            className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all"
                                            placeholder="Nom complet"
                                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2 tracking-widest">Numéro de téléphone</label>
                                        <input
                                            required
                                            type="tel"
                                            className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all"
                                            placeholder="06 XX XX XX XX"
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2 tracking-widest">Ville</label>
                                        <input
                                            required
                                            className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all"
                                            placeholder="Ex: Casablanca"
                                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-slate-500 mb-2 tracking-widest">Adresse</label>
                                        <input
                                            required
                                            className="w-full bg-slate-50 dark:bg-slate-900 border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/20 transition-all"
                                            placeholder="Adresse exacte"
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-3">
                                    <span className="material-symbols-outlined text-primary">payments</span>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">Paiement à la livraison (Cash on Delivery)</h4>
                                        <p className="text-xs text-slate-500 mt-1">Payez en espèces dès réception de votre commande à votre porte.</p>
                                    </div>
                                </div>

                                {error && (
                                    <div className="bg-red-50 text-red-500 p-4 rounded-xl text-xs font-bold uppercase tracking-widest border border-red-100 italic">
                                        ⚠️ {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-primary text-white py-5 rounded-2xl font-bold uppercase text-xs tracking-widest hover:bg-primary/95 transition-all mt-6 disabled:opacity-50"
                                >
                                    {loading ? 'Traitement en cours...' : 'Confirmer la commande'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="w-full lg:w-96">
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 sticky top-24">
                            <h2 className="text-lg font-bold uppercase tracking-tight mb-8">Votre Commande</h2>
                            <div className="space-y-4 mb-8">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex justify-between items-center text-sm">
                                        <span className="text-slate-500 flex-1 line-clamp-1 italic">{item.brand} — {item.name}</span>
                                        <span className="font-bold text-slate-900 dark:text-white ml-4">{item.price} DH</span>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-3 pt-6 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex justify-between text-sm text-slate-500 uppercase tracking-widest">
                                    <span>Sous-total</span>
                                    <span>{cartTotal.toLocaleString()} DH</span>
                                </div>
                                <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                                    <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl flex items-center gap-2">
                                        <span className="text-lg">💳</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">Paiement à la livraison</span>
                                    </div>
                                </div>
                                <div className="flex justify-between text-xl font-black text-slate-900 dark:text-white pt-4">
                                    <span>TOTAL</span>
                                    <span>{cartTotal.toLocaleString()} DH</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
