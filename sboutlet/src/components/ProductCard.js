import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ProductCard = ({
    id,
    brand,
    name,
    price,
    oldPrice = null,
    image,
    favorite: initialFavorite = false,
    tag = null,
    discount = null,
}) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    // Robust price parsing (handles numbers and strings like "670 DH")
    const parsePrice = (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        // Remove "DH", spaces, and commas
        const clean = String(val).replace(/[^\d.]/g, '');
        return parseFloat(clean) || 0;
    };

    const numPrice = parsePrice(price);
    const numDiscount = Number(discount) || 0;
    const hasDiscount = numDiscount > 0;

    const finalPrice = hasDiscount ? numPrice * (1 - numDiscount / 100) : numPrice;
    const strikePrice = hasDiscount ? numPrice : (parsePrice(oldPrice) || null);

    const goToDetail = () => navigate(`/product/${id}`);

    const handleAddToCart = (e) => {
        e.stopPropagation();
        addToCart({ id, brand, name, price: finalPrice, image });
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    };

    return (
        <div
            className="group relative bg-white rounded-[2rem] overflow-hidden flex flex-col h-full border border-slate-100/50"
            style={{
                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.06)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
            onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 20px 40px -15px rgba(218,11,63,0.15)';
                e.currentTarget.style.transform = 'translateY(-6px)';
            }}
            onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.06)';
                e.currentTarget.style.transform = 'translateY(0)';
            }}
        >
            {/* ── IMAGE ZONE ── */}
            <div
                onClick={goToDetail}
                className="relative overflow-hidden bg-slate-50 cursor-pointer"
                style={{ aspectRatio: '4 / 5' }}
            >
                <img
                    src={image}
                    alt={name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Glassmorphism View Details Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"></div>
                    <span className="relative z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-black uppercase tracking-[0.15em] px-6 py-3 rounded-2xl shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                        Aperçu
                    </span>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    <span className="bg-slate-900/90 backdrop-blur-md text-white text-[8px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-lg flex items-center gap-1.5 border border-white/10">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                        Unique
                    </span>
                    {hasDiscount && (
                        <span className="bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-lg border border-primary-400">
                            -{numDiscount}%
                        </span>
                    )}
                </div>
            </div>

            {/* ── CONTENT ZONE ── */}
            <div className="flex flex-col flex-grow p-5 sm:p-6">
                <div className="mb-2">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1">
                        {brand || 'SB Outlet'}
                    </p>
                    <h3
                        onClick={goToDetail}
                        className="text-[15px] font-bold text-slate-800 leading-[1.4] line-clamp-2 cursor-pointer group-hover:text-primary transition-colors min-h-[2.8em]"
                    >
                        {name}
                    </h3>
                </div>

                <div className="flex-grow" />

                {/* Price Display */}
                <div className="flex flex-wrap items-baseline gap-2 mb-4">
                    <span className="text-xl font-black text-slate-900 tracking-tight">
                        {Math.round(finalPrice).toLocaleString('fr-FR')} <span className="text-[13px] font-black text-primary ml-0.5">DH</span>
                    </span>
                    {strikePrice && strikePrice > finalPrice && (
                        <span className="text-xs font-bold text-slate-400 line-through decoration-primary/30 tracking-tight">
                            {Math.round(strikePrice).toLocaleString('fr-FR')} DH
                        </span>
                    )}
                </div>

                <button
                    onClick={handleAddToCart}
                    className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all active:scale-95 ${added
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200'
                        : 'bg-slate-900 hover:bg-primary text-white shadow-lg shadow-slate-200'
                        }`}
                >
                    <span className="material-symbols-outlined text-[18px]">
                        {added ? 'done_all' : 'local_mall'}
                    </span>
                    {added ? 'Ajouté !' : 'Panier'}
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
