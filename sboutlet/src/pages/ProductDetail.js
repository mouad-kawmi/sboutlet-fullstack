import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAdmin } from '../context/AdminContext';
import ProductCard from '../components/ProductCard';
import api from '../api/axios';

/* ── Condition badge config ────────────────────────────────── */
const CONDITIONS = {
    'Neuf avec étiquettes': { color: '#10b981', bg: '#d1fae5', icon: 'new_releases' },
    'Excellent État': { color: '#6366f1', bg: '#e0e7ff', icon: 'star' },
    'Très bon état': { color: '#3b82f6', bg: '#dbeafe', icon: 'thumb_up' },
    'Bon état': { color: '#f59e0b', bg: '#fef3c7', icon: 'check_circle' },
};

const fmt = (n) => n ? `${Number(n).toLocaleString('fr-FR')} DH` : null;

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { availableProducts, loading: contextLoading } = useAdmin();
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const findAndSetProduct = async () => {
            setLoading(true);
            // 1. Try to find in context
            const found = availableProducts.find(p => String(p.id) === String(id));
            
            if (found) {
                setProduct(found);
                setLoading(false);
            } else {
                // 2. Fallback: Fetch directly from API
                try {
                    const response = await api.get(`/products/${id}`);
                    // We need to normalize it since it's a raw piece of data from API
                    const normalizeProduct = (p) => {
                        const baseUrl = process.env.REACT_APP_IMAGE_URL || 'http://127.0.0.1:8000/storage';
                        const fixPath = (path) => {
                            if (!path) return '';
                            if (path.startsWith('http')) return path;
                            return `${baseUrl}/${path.replace(/\\/g, '/')}`;
                        };
                        return {
                            ...p,
                            image: fixPath(p.main_image),
                            images: p.images ? p.images.map(img => ({
                                id: img.id,
                                url: fixPath(typeof img === 'string' ? img : img.image_url)
                            })) : [],
                            condition: p.condition_status,
                            oldPrice: p.old_price,
                        };
                    };
                    setProduct(normalizeProduct(response.data));
                } catch (err) {
                    console.error("Product not found:", err);
                    setError(true);
                } finally {
                    setLoading(false);
                }
            }
        };

        findAndSetProduct();
    }, [id, availableProducts]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined text-4xl text-slate-300">inventory_2</span>
                </div>
                <div className="text-center">
                    <p className="text-slate-900 text-xl font-black uppercase tracking-tight mb-2">Pièce plus disponible</p>
                    <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8">Cet article a été vendu ou n'existe pas.</p>
                    <button onClick={() => navigate('/')} className="px-8 py-3 bg-primary text-white font-black uppercase text-xs tracking-widest rounded-xl shadow-lg shadow-primary/20">
                        Retour à la boutique
                    </button>
                </div>
            </div>
        );
    }

    const hasDiscount = product.discount && product.discount > 0;
    const finalPriceNum = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;

    // Gallery construction
    const gallery = (Array.isArray(product.images) && product.images.length > 0) 
        ? product.images 
        : [product.image];

    // Final normalized data for view
    const viewData = {
        ...product,
        displayPrice: fmt(finalPriceNum),
        displayOldPrice: hasDiscount ? fmt(product.price) : null,
        rawPrice: finalPriceNum,
        ref: product.ref || `REF-${String(product.id).toUpperCase()}`,
        year: product.year || '2024',
        images: gallery,
        description: product.description || `${product.name} — pièce de luxe d'occasion. Authentifiée par SBOutlet.`,
        includes: product.includes || [
            { icon: 'verified', text: 'Certificat d\'authenticité SBOutlet' },
            { icon: 'local_shipping', text: 'Livraison sécurisée partout au Maroc' },
            { icon: 'payments', text: '💳 Paiement à la livraison uniquement' },
            { icon: 'autorenew', text: 'Retour sous 14 jours' },
        ],
    };

    const cond = CONDITIONS[product.condition] || CONDITIONS['Excellent État'];
    const similar = availableProducts.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

    return <DetailView
        product={viewData}
        raw={product}
        cond={cond}
        discount={product.discount > 0 ? product.discount : null}
        similar={similar}
        navigate={navigate}
        addToCart={addToCart}
    />;
};

/* ── Stateful view (separated to allow clean hooks) ─────────── */
const DetailView = ({ product, raw, cond, discount, similar, navigate, addToCart }) => {
    const [activeImg, setActiveImg] = useState(0);
    const [cartDone, setCartDone] = useState(false);

    const handleAddToCart = () => {
        addToCart({ ...raw, id: raw.id, price: product.rawPrice });
        setCartDone(true);
        setTimeout(() => setCartDone(false), 2000);
    };

    return (
        <div className="bg-[#F9F9FB] min-h-screen font-display">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-10">
                    <button onClick={() => navigate('/')} className="hover:text-primary-600 transition-colors">Accueil</button>
                    <span className="material-symbols-outlined text-[13px]">chevron_right</span>
                    <button onClick={() => navigate(-1)} className="hover:text-primary-600 transition-colors">{product.brand}</button>
                    <span className="material-symbols-outlined text-[13px]">chevron_right</span>
                    <span className="text-slate-700 truncate max-w-[200px]">{product.name}</span>
                </nav>

                <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">

                    {/* ── Gallery ── */}
                    <div className="lg:w-[55%] flex flex-col gap-6">
                         <div className="relative rounded-[2.5rem] overflow-hidden bg-white shadow-xl ring-1 ring-slate-100" style={{ aspectRatio: '4/5' }}>
                             <img
                                 key={activeImg}
                                 src={(product.images && product.images[activeImg]) ? product.images[activeImg].url : product.image}
                                 alt={product.name}
                                 className="w-full h-full object-cover select-none transition-all duration-700"
                                 onError={(e) => {
                                     if (e.target.src !== product.image) e.target.src = product.image;
                                 }}
                                 style={{ animation: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
                             />
                             {/* Badges Overlay */}
                             <div className="absolute top-6 left-6 flex flex-col gap-3">
                                 <span className="bg-[#1e293b]/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-white/10 w-max">
                                     <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                     Pièce Unique
                                 </span>
                                 {discount && (
                                     <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full shadow-2xl w-max text-center border border-white/10">
                                         -{discount}% OFF
                                     </span>
                                 )}
                             </div>
                         </div>
 
                         {/* Thumbnails */}
                         <div className="flex gap-4 overflow-x-auto pb-4 px-1 no-scrollbar">
                             {product.images && product.images.length > 1 && product.images.map((imgObj, i) => (
                                 <button
                                     key={i}
                                     onClick={() => setActiveImg(i)}
                                     className={`w-20 h-20 sm:w-28 sm:h-28 flex-shrink-0 rounded-[1.25rem] overflow-hidden bg-white shadow-md border-3 transition-all duration-300 transform ${activeImg === i
                                         ? 'border-primary-600 scale-105'
                                         : 'border-transparent opacity-60 hover:opacity-100'
                                         }`}
                                 >
                                     <img 
                                         src={imgObj.url} 
                                         alt={`vue ${i + 1}`} 
                                         className="w-full h-full object-cover" 
                                         onError={(e) => { e.target.src = product.image; }}
                                     />
                                 </button>
                             ))}
                         </div>
                    </div>

                    {/* ── Info ── */}
                    <div className="lg:w-[48%] flex flex-col gap-6">

                        <div>
                            {product.brand && product.brand !== 'Non spécifié' && (
                                <p className="text-xs font-black text-primary-600 uppercase tracking-[.2em] mb-2">{product.brand}</p>
                            )}
                            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-3">{product.name}</h1>
                            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-widest">Réf. {product.ref} · {product.year}</p>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-4 pb-6 border-b border-slate-200">
                            <span className="text-3xl font-black text-primary-700 tracking-tight">{product.displayPrice}</span>
                            {product.displayOldPrice && (
                                <div className="flex flex-col">
                                    <span className="text-sm text-slate-400 line-through">{product.displayOldPrice}</span>
                                    <span className="text-[10px] text-slate-400 font-semibold">Prix neuf estimé</span>
                                </div>
                            )}
                        </div>

                        {/* Condition */}
                        <div className="rounded-2xl p-4 flex gap-4 items-start border" style={{ background: cond.bg + '99', borderColor: cond.color + '44' }}>
                            <span className="material-symbols-outlined text-2xl mt-0.5 flex-shrink-0" style={{ color: cond.color }}>{cond.icon}</span>
                            <div>
                                <p className="font-black text-sm" style={{ color: cond.color }}>{product.condition}</p>
                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{product.conditionNote}</p>
                            </div>
                        </div>



                        {/* Description */}
                        <div>
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Description</h3>
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-4">{product.description}</p>

                            <ul className="space-y-2">
                                {product.details && (
                                    <li className="flex gap-2 text-sm text-slate-600">
                                        <span className="font-bold text-slate-900 flex-shrink-0">• Détails :</span>
                                        <span>{product.details}</span>
                                    </li>
                                )}
                                {product.design && (
                                    <li className="flex gap-2 text-sm text-slate-600">
                                        <span className="font-bold text-slate-900 flex-shrink-0">• Design :</span>
                                        <span>{product.design}</span>
                                    </li>
                                )}
                                {product.size && (
                                    <li className="flex gap-2 text-sm text-slate-600">
                                        <span className="font-bold text-slate-900 flex-shrink-0">• Taille :</span>
                                        <span>{product.size}</span>
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Includes */}
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Ce qui est inclus</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {product.includes.map((item, i) => (
                                    <div key={i} className="flex items-center gap-2.5">
                                        <span className="material-symbols-outlined text-[18px] text-primary-500">{item.icon}</span>
                                        <span className="text-xs text-slate-700 font-semibold">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={handleAddToCart}
                                className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all active:scale-95 shadow-lg"
                                style={{
                                    background: cartDone ? '#10b981' : '#da0b3f',
                                    color: '#fff',
                                    boxShadow: cartDone ? '0 8px 24px rgba(16,185,129,.35)' : '0 8px 24px rgba(218,11,63,.35)',
                                }}
                            >
                                <span className="material-symbols-outlined text-[20px]">{cartDone ? 'check_circle' : 'add_shopping_cart'}</span>
                                {cartDone ? 'Ajouté !' : 'Ajouter au panier'}
                            </button>

                        </div>

                        {/* WhatsApp strip */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-900 text-white rounded-2xl px-5 py-4">
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-sm">Une question sur cet article ?</p>
                                <p className="text-[11px] text-slate-400 mt-0.5">Nos conseillers répondent en quelques minutes</p>
                            </div>
                            <a href={`https://wa.me/${process.env.REACT_APP_WHATSAPP_NUMBER}?text=${encodeURIComponent(`Bonjour SB Outlet, je suis intéressé(e) par l'article : ${product.name} (Ref: ${product.ref})`)}`} target="_blank" rel="noreferrer"
                                className="flex items-center gap-2 bg-[#25d366] hover:bg-[#1ebd5a] text-white font-black text-xs uppercase tracking-widest px-5 py-3 rounded-xl transition-all flex-shrink-0">
                                <span className="material-symbols-outlined text-[18px]">chat</span>
                                WhatsApp
                            </a>
                        </div>

                        {/* Trust badges */}
                        <div className="grid grid-cols-3 gap-3 text-center">
                            {[
                                { icon: 'payments', label: 'Paiement à la livraison' },
                                { icon: 'autorenew', label: 'Retour 14 jours' },
                                { icon: 'gpp_good', label: 'Authenticité garantie' },
                            ].map(b => (
                                <div key={b.label} className="bg-white rounded-2xl py-3 px-2 border border-slate-100 flex flex-col items-center gap-1.5 shadow-sm">
                                    <span className="material-symbols-outlined text-primary-500 text-[22px]">{b.icon}</span>
                                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wide leading-tight">{b.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Similar products */}
            {similar.length > 0 && (
                <div className="border-t border-slate-200 mt-8 py-14">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-end justify-between mb-10">
                            <div>
                                <p className="text-[11px] font-black text-primary-500 uppercase tracking-[.2em] mb-1">Sélection pour vous</p>
                                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Vous aimerez aussi</h2>
                            </div>
                            <button onClick={() => navigate(-1)}
                                className="hidden sm:flex items-center gap-1.5 text-[11px] font-black text-slate-400 hover:text-primary-600 uppercase tracking-widest transition-colors group">
                                Voir tout
                                <span className="material-symbols-outlined text-[16px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {similar.map(p => (
                                <ProductCard
                                    key={p.id}
                                    {...p}
                                    price={fmt(p.price)}
                                    oldPrice={fmt(p.oldPrice)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <style>{`@keyframes fadeIn { from { opacity:0; transform:scale(1.02); } to { opacity:1; transform:scale(1); } }`}</style>
        </div>
    );
};

export default ProductDetail;
