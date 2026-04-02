import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';

const NON_NEGATIVE_FIELDS = {
    price: { min: 0, step: '0.01', label: 'Prix (DH)' },
    oldPrice: { min: 0, step: '0.01', label: 'Ancien Prix (DH)' },
    discount: { min: 0, max: 100, step: '1', label: 'Reduction (%)' },
    stock: { min: 0, step: '1', label: 'Stock' },
};

/* ── helpers ─────────────────────────────────────────────────── */
const STATUS_COLORS = {
    'En attente': { bg: '#fef3c7', color: '#d97706', dot: '#f59e0b' },
    'Livré': { bg: '#d1fae5', color: '#059669', dot: '#10b981' },
    'Annulé': { bg: '#fee2e2', color: '#dc2626', dot: '#ef4444' },
};

const CONDITION_OPTIONS = ['Neuf avec étiquettes', 'Excellent État', 'Très bon état', 'Bon état'];
const CATEGORY_OPTIONS = ['Femme', 'Homme', 'Enfants', 'Accessoires'];
const STATUS_OPTIONS = ['En attente', 'Livré', 'Annulé'];
const EMPTY_PRODUCT = { name: '', price: '', discount: '', category: 'Femme', condition: 'Excellent État', stock: 1, image: '', images: [], description: '', details: '', design: '', size: '' };


/* ── Stat card ───────────────────────────────────────────────── */
const StatCard = ({ icon, label, value, sub, color = '#da0b3f' }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: color + '18' }}>
                <span className="material-symbols-outlined text-2xl" style={{ color }}>{icon}</span>
            </div>
        </div>
        <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
        <p className="text-sm font-semibold text-slate-500 mt-1">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
);

/* ── Section: Dashboard overview ─────────────────────────────── */
const Dashboard = () => {
    const { stats, orders, updateOrderStatus } = useAdmin();
    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-black text-slate-900 mb-1">Tableau de bord</h2>
                <p className="text-sm text-slate-500">Vue d'ensemble de votre boutique</p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon="paid" label="Ventes" value={`${stats.totalRevenue.toLocaleString('fr-FR')} DH`} sub="Livrées" color="#da0b3f" />
                <StatCard icon="pending_actions" label="À traiter" value={stats.pendingOrders} sub="En attente" color="#da0b3f" />
                <StatCard icon="task_alt" label="Livrées" value={orders.filter(o => o.status === 'Livré').length} sub="Terminées" color="#059669" />
                <StatCard icon="inventory_2" label="Produits" value={stats.totalProducts} sub="En ligne" color="#be0a37" />
            </div>

            {/* Recent orders */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-black text-slate-900">Commandes récentes</h3>
                    <button onClick={() => setPage('orders')} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Voir tout</button>
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-left">
                                {['N° Commande', 'Client', 'Ville', 'Total', 'Statut', 'Action'].map(h => (
                                    <th key={h} className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {orders.slice(0, 5).map(order => {
                                const sc = STATUS_COLORS[order.status] || STATUS_COLORS['En attente'];
                                return (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-4 font-bold text-primary-600">{order.id}</td>
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-slate-900">{order.customer}</p>
                                            <p className="text-xs text-slate-400">{order.phone}</p>
                                        </td>
                                        <td className="px-5 py-4 text-slate-600">{order.city}</td>
                                        <td className="px-5 py-4 font-black text-slate-900">{order.total.toLocaleString('fr-FR')} DH</td>
                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: sc.bg, color: sc.color }}>
                                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }}></span>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <select
                                                value={order.status}
                                                onChange={e => updateOrderStatus(order.id, e.target.value)}
                                                disabled={order.status === 'Livré' || order.status === 'Annulé'}
                                                className={`text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 focus:outline-none focus:border-primary-400 font-semibold ${(order.status === 'Livré' || order.status === 'Annulé') ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'cursor-pointer'
                                                    }`}
                                            >
                                                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                                            </select>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile/Tablet Card View */}
                <div className="lg:hidden divide-y divide-slate-50">
                    {orders.slice(0, 5).map(order => {
                        const sc = STATUS_COLORS[order.status] || STATUS_COLORS['En attente'];
                        return (
                            <div key={order.id} className="p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="font-black text-primary-600 text-[13px]">{order.id}</span>
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: sc.bg, color: sc.color }}>
                                        <span className="w-1 h-1 rounded-full" style={{ background: sc.dot }}></span>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">{order.customer}</p>
                                        <p className="text-[11px] text-slate-400">{order.phone} • {order.city}</p>
                                    </div>
                                    <p className="font-black text-slate-900 text-sm">{order.total.toLocaleString('fr-FR')} DH</p>
                                </div>
                                <select
                                    value={order.status}
                                    onChange={e => updateOrderStatus(order.id, e.target.value)}
                                    disabled={order.status === 'Livré' || order.status === 'Annulé'}
                                    className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 text-slate-600 focus:outline-none font-semibold bg-white"
                                >
                                    {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

/* ── Product form modal ──────────────────────────────────────── */
const ProductModal = ({ product = null, onClose, afterSave }) => {
    const { addProduct, updateProduct } = useAdmin();
    const [form, setForm] = useState(product || EMPTY_PRODUCT);

    const set = (k, v) => {
        const rule = NON_NEGATIVE_FIELDS[k];

        if (rule && v !== '') {
            const numericValue = Number(v);

            if (!Number.isNaN(numericValue)) {
                if (numericValue < rule.min) {
                    v = String(rule.min);
                } else if (rule.max !== undefined && numericValue > rule.max) {
                    v = String(rule.max);
                }
            }
        }

        setForm(f => ({ ...f, [k]: v }));
    };

    const handleImageUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setForm(prev => {
                const newFiles = [...(prev.imageFiles || []), ...files].slice(0, 4);
                return { ...prev, imageFiles: newFiles };
            });
        }
    };

    const removeImage = (index) => {
        setForm(prev => {
            const newFiles = (prev.imageFiles || []).filter((_, i) => i !== index);
            return { ...prev, imageFiles: newFiles };
        });
    };

    const submit = async (e) => {
        e.preventDefault();

        const invalidField = Object.entries(NON_NEGATIVE_FIELDS).find(([key, rule]) => {
            const value = form[key];
            if (value === '' || value === null || value === undefined) return false;

            const numericValue = Number(value);
            if (Number.isNaN(numericValue)) return false;
            if (numericValue < rule.min) return true;
            if (rule.max !== undefined && numericValue > rule.max) return true;

            return false;
        });

        if (invalidField) {
            const [, rule] = invalidField;
            const maxMessage = rule.max !== undefined ? ` et au maximum ${rule.max}` : '';
            alert(`${rule.label} doit etre au minimum ${rule.min}${maxMessage}.`);
            return;
        }

        const formData = new FormData();

        formData.append('name', form.name);
        formData.append('brand', form.brand || '');
        formData.append('price', form.price);
        if (form.oldPrice) formData.append('old_price', form.oldPrice);
        formData.append('category', form.category);
        formData.append('condition_status', form.condition || 'Excellent État');
        formData.append('stock', form.stock || 0);
        formData.append('description', form.description || '');
        if (form.discount) formData.append('discount', form.discount);
        if (form.details) formData.append('details', form.details);
        if (form.design) formData.append('design', form.design);
        if (form.size) formData.append('size', form.size);

        if (form.imageFiles && form.imageFiles.length > 0) {
            formData.append('main_image', form.imageFiles[0]);
            form.imageFiles.forEach((file, idx) => {
                formData.append('images[]', file);
            });
        }

        const res = product
            ? await updateProduct(product.id, formData)
            : await addProduct(formData);

        if (res.success) {
            await afterSave?.(product ? 'update' : 'create');
            onClose();
        } else alert(res.error);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h3 className="font-black text-slate-900">{product ? 'Modifier le produit' : 'Ajouter un produit'}</h3>
                    <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                </div>
                <form onSubmit={submit} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { label: 'Nom', key: 'name', type: 'text' },
                            { label: 'Marque', key: 'brand', type: 'text' },
                            { label: 'Prix (DH)', key: 'price', type: 'number' },
                            { label: 'Ancien Prix (DH)', key: 'oldPrice', type: 'number' },
                            { label: 'Réduction (%)', key: 'discount', type: 'number' },
                            { label: 'Stock', key: 'stock', type: 'number' },
                            { label: 'Taille', key: 'size', type: 'text' },
                            { label: 'Design', key: 'design', type: 'text' },
                            { label: 'Détails', key: 'details', type: 'text' },
                        ].map(({ label, key, type }) => (
                            <div key={key}>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">{label}</label>
                                <input
                                    type={type}
                                    value={form[key] ?? ''}
                                    onChange={e => set(key, e.target.value)}
                                    min={NON_NEGATIVE_FIELDS[key]?.min}
                                    max={NON_NEGATIVE_FIELDS[key]?.max}
                                    step={NON_NEGATIVE_FIELDS[key]?.step}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition"
                                    required={['name', 'price'].includes(key)}
                                />
                            </div>
                        ))}

                        {/* Category Select */}
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Catégorie</label>
                            <select
                                value={form.category}
                                onChange={e => set('category', e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition bg-white"
                                required
                            >
                                {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Multiple Images Upload */}
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5 ">Images du produit (Max 4)</label>
                        <div className="grid grid-cols-4 gap-2 mb-3">
                            {/* Existing Images (if editing) */}
                            {product && !form.imageFiles && product.image && (
                                <div className="aspect-square rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                                    <img src={product.image} className="w-full h-full object-cover" alt="current" />
                                </div>
                            )}

                            {/* New Files Preview */}
                            {(form.imageFiles || []).map((file, idx) => (
                                <div key={idx} className="relative group aspect-square rounded-xl border border-slate-200 overflow-hidden bg-slate-50">
                                    <img src={URL.createObjectURL(file)} alt={`preview-${idx}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <span className="material-symbols-outlined text-[12px]">close</span>
                                    </button>
                                </div>
                            ))}
                            {(form.imageFiles || []).length < 4 && (
                                <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-primary-300 hover:bg-primary-50 transition-all">
                                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                                    <span className="material-symbols-outlined text-slate-400 text-[20px]">add_a_photo</span>
                                    <span className="text-[8px] font-bold text-slate-400 mt-1">Ajouter</span>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Description du produit</label>
                        <textarea
                            value={form.description || ''}
                            onChange={e => set('description', e.target.value)}
                            rows="4"
                            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition resize-none"
                            placeholder="Entrez les détails du produit..."
                            required
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Catégorie</label>
                            <select value={form.category} onChange={e => set('category', e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-primary-400">
                                {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1.5">État</label>
                            <select value={form.condition} onChange={e => set('condition', e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-primary-400">
                                {CONDITION_OPTIONS.map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-primary hover:bg-primary-600 text-white py-3 rounded-xl font-bold text-sm tracking-wide transition-all active:scale-95 mt-2">
                        {product ? 'Enregistrer les modifications' : 'Ajouter le produit'}
                    </button>
                </form>
            </div>
        </div>
    );
};

/* ── Section: Products management ────────────────────────────── */
const Products = () => {
    const { products, pagination, fetchProductsPage, deleteProduct, stats } = useAdmin();
    const [modal, setModal] = useState(null); // null | 'add' | product obj
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('Tous');

    useEffect(() => {
        fetchProductsPage(1, { category: catFilter, in_stock: 'false' });
    }, [catFilter]);

    const handlePageChange = (p) => {
        fetchProductsPage(p, { category: catFilter, in_stock: 'false' });
    };

    const handleProductSaved = async (mode) => {
        const targetPage = mode === 'create' ? 1 : (pagination?.current_page || 1);
        await fetchProductsPage(targetPage, { category: catFilter, in_stock: 'false' });
    };

    // Keep some local search for minor tweaks if needed, but primary list comes from server
    const displayList = pagination?.data || [];
    const filtered = displayList.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {modal && (
                <ProductModal
                    product={modal === 'add' ? null : modal}
                    onClose={() => setModal(null)}
                    afterSave={handleProductSaved}
                />
            )}

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">Produits</h2>
                    <p className="text-sm text-slate-500">{(pagination?.total || stats?.totalProducts || 0)} articles au total</p>
                </div>
                <button
                    onClick={() => setModal('add')}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-600 text-white px-5 py-3 sm:py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-md shadow-primary-200"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Ajouter un produit
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                    <input
                        type="text"
                        placeholder="Rechercher…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100"
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar shrink-0">
                    {['Tous', ...CATEGORY_OPTIONS].map(c => (
                        <button key={c} onClick={() => setCatFilter(c)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${catFilter === c ? 'bg-primary text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:border-primary-300'}`}>
                            {c}
                        </button>
                    ))}
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-50 text-left">
                                {['Produit', 'Catégorie', 'Stock', 'Prix', 'Ancien prix', 'Actions'].map(h => (
                                    <th key={h} className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filtered.map(p => (
                                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={p.image} alt={p.name} className="w-12 h-12 rounded-xl object-cover bg-slate-100 flex-shrink-0" />
                                            <div>
                                                <p className="font-bold text-slate-900 leading-tight">{p.name}</p>
                                                <p className="text-xs text-slate-400">{p.brand}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">{p.category}</span>
                                    </td>
                                    <td className="px-5 py-4">
                                        {p.stock > 0 ? (
                                            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-100 italic">En stock</span>
                                        ) : (
                                            <span className="px-2.5 py-1 bg-red-50 text-red-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-red-100 italic">Vendu</span>
                                        )}
                                    </td>
                                    <td className="px-5 py-4 font-black text-primary-700 whitespace-nowrap">
                                        {(p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price).toLocaleString('fr-FR')} DH
                                    </td>
                                    <td className="px-5 py-4 text-slate-400 line-through text-xs whitespace-nowrap">
                                        {p.discount > 0 ? `${p.price?.toLocaleString('fr-FR')} DH` : '-'}
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => setModal(p)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-600 transition-colors">
                                                <span className="material-symbols-outlined text-[16px]">edit</span>
                                            </button>
                                            <button onClick={() => { if (window.confirm('Supprimer ce produit ?')) deleteProduct(p.id); }}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors">
                                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filtered.length === 0 && (
                    <div className="py-16 text-center text-slate-400">
                        <span className="material-symbols-outlined text-4xl block mb-2">search_off</span>
                        Aucun produit trouvé
                    </div>
                )}
            </div>

            {/* Mobile/Tablet Card View */}
            <div className="lg:hidden space-y-4">
                {filtered.map(p => (
                    <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex gap-4">
                        <img src={p.image} alt={p.name} className="w-20 h-20 rounded-xl object-cover bg-slate-100 flex-shrink-0" />
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                            <div>
                                <div className="flex justify-between items-start gap-2">
                                    <p className="font-bold text-slate-900 leading-tight truncate">{p.name}</p>
                                    <div className="flex gap-1 shrink-0">
                                        <button onClick={() => setModal(p)} className="w-7 h-7 flex items-center justify-center rounded-lg bg-primary-50 text-primary-600"><span className="material-symbols-outlined text-[14px]">edit</span></button>
                                        <button onClick={() => { if (window.confirm('Supprimer ce produit ?')) deleteProduct(p.id); }} className="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 text-red-500"><span className="material-symbols-outlined text-[14px]">delete</span></button>
                                    </div>
                                </div>
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider mt-1">{p.brand} • {p.category}</p>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-sm font-black text-primary-700">
                                    {(p.discount > 0 ? p.price * (1 - p.discount / 100) : p.price).toLocaleString('fr-FR')} DH
                                </span>
                                <div className="flex gap-2">
                                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider border ${p.stock > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                        {p.stock > 0 ? 'Disponible' : 'Vendu'}
                                    </span>
                                    <span className="text-[9px] px-2 py-0.5 bg-slate-50 text-slate-400 rounded-full font-bold border border-slate-100 truncate max-w-[80px]">{p.condition}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {filtered.length === 0 && (
                    <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                        <span className="material-symbols-outlined text-slate-300 text-3xl block mb-2">inventory_2</span>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Aucun produit trouvé</p>
                    </div>
                )}
            </div>

            {pagination && (
                <Pagination
                    current={pagination.current_page}
                    last={pagination.last_page}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

/* ── Section: Orders management ──────────────────────────────── */
const Orders = () => {
    const { orders, updateOrderStatus } = useAdmin();
    const [statusFilter, setStatusFilter] = useState('Tous');

    const filtered = statusFilter === 'Tous' ? orders : orders.filter(o => o.status === statusFilter);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-black text-slate-900">Commandes</h2>
                <p className="text-sm text-slate-500">
                    {statusFilter === 'Tous'
                        ? `${orders.length} commandes au total`
                        : `${filtered.length} ${filtered.length > 1 ? 'commandes' : 'commande'} ${statusFilter.toLowerCase()}`}
                </p>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {['Tous', ...STATUS_OPTIONS].map(s => {
                    const active = statusFilter === s;
                    return (
                        <button
                            key={s}
                            onClick={() => setStatusFilter(s)}
                            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all border shadow-sm whitespace-nowrap ${active
                                ? 'bg-primary border-primary text-white shadow-primary-200'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-primary-300 hover:text-primary-600'
                                }`}
                        >
                            {s}
                        </button>
                    );
                })}
            </div>

            <div className="space-y-4">
                {filtered.map(order => {
                    const sc = STATUS_COLORS[order.status] || STATUS_COLORS['En attente'];
                    return (
                        <div key={order.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-black text-primary-600 text-sm">{order.id}</span>
                                        <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: sc.bg, color: sc.color }}>
                                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: sc.dot }}></span>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400">{order.date}</p>
                                </div>
                                <select
                                    value={order.status}
                                    onChange={e => updateOrderStatus(order.id, e.target.value)}
                                    disabled={order.status === 'Livré' || order.status === 'Annulé'}
                                    className={`text-xs border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-primary-400 font-semibold ${(order.status === 'Livré' || order.status === 'Annulé') ? 'opacity-50 cursor-not-allowed bg-slate-50' : 'cursor-pointer'
                                        }`}
                                >
                                    {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Client</p>
                                    <p className="font-bold text-slate-900">{order.customer}</p>
                                    <p className="text-sm text-slate-500">{order.phone}</p>
                                    <p className="text-sm text-slate-500">{order.city}</p>

                                    {/* Botao WhatsApp */}
                                    <a
                                        href={`https://api.whatsapp.com/send?phone=${order.phone.replace(/\s/g, '').replace(/^0/, '212')}&text=${encodeURIComponent(
                                            `Bonjour ${order.customer}, Merci pour votre commande sur SBOutlet !\n\n*Détails de la commande :*\n${order.items.map(i => `- ${i.name} (${i.qty})`).join('\n')}\n*Total : ${order.total.toLocaleString('fr-FR')} DH*\n\nPourriez-vous nous confirmer votre commande en répondant par "OUI" ?\n\nMerci !`
                                        )}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-4 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebd5a] text-white text-[11px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all shadow-sm"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">chat</span>
                                        Contacter via WhatsApp
                                    </a>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Articles</p>
                                    {order.items.map((item, i) => (
                                        <div key={i} className="flex justify-between text-sm">
                                            <span className="text-slate-700">{item.name} <span className="text-slate-400">× {item.qty}</span></span>
                                            <span className="font-bold text-slate-900">{item.price.toLocaleString('fr-FR')} DH</span>
                                        </div>
                                    ))}
                                    <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between">
                                        <span className="font-bold text-slate-600 text-sm">Total</span>
                                        <span className="font-black text-primary-700">{order.total.toLocaleString('fr-FR')} DH</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                {filtered.length === 0 && (
                    <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="material-symbols-outlined text-slate-300 text-3xl">inbox</span>
                        </div>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Aucune commande {statusFilter !== 'Tous' ? statusFilter.toLowerCase() : ''}</p>
                    </div>
                )
                }
            </div>
        </div>
    );
};

/* ── Main Admin Panel ────────────────────────────────────────── */
const PAGES = [
    { key: 'dashboard', label: 'Tableau de bord', icon: 'dashboard' },
    { key: 'products', label: 'Produits', icon: 'inventory_2' },
    { key: 'orders', label: 'Commandes', icon: 'receipt_long' },
];

const AdminPanel = () => {
    const { stats, refreshData } = useAdmin();
    const { currentUser, logout, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [page, setPage] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        refreshData();
    }, []);

    // Wait for auth check to complete before redirecting
    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#F4F5F9] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium">Chargement...</p>
                </div>
            </div>
        );
    }

    if (!currentUser || currentUser.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="min-h-screen bg-[#F4F5F9] flex relative">

            {/* ── Mobile Sidebar Overlay ── */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[140] lg:hidden"
                    onClick={closeSidebar}
                ></div>
            )}

            {/* ── Sidebar ── */}
            <aside className={`
                fixed inset-y-0 left-0 z-[150] w-64 bg-slate-900 flex flex-col shrink-0 transition-transform duration-300 transform
                lg:translate-x-0 lg:static lg:inset-auto
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Logo */}
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow">
                            <span className="material-symbols-outlined text-white text-[18px]">storefront</span>
                        </div>
                        <div>
                            <p className="font-black text-white text-sm leading-tight">SBOutlet</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Admin</p>
                        </div>
                    </div>
                    {/* Close button mobile */}
                    <button onClick={closeSidebar} className="lg:hidden text-slate-400 hover:text-white">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-4 space-y-1">
                    {PAGES.map(pg => (
                        <button
                            key={pg.key}
                            onClick={() => {
                                setPage(pg.key);
                                closeSidebar();
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${page === pg.key ? 'bg-primary text-white shadow-md shadow-primary-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                            <span className="material-symbols-outlined text-[20px]">{pg.icon}</span>
                            {pg.label}
                            {pg.key === 'orders' && stats.pendingOrders > 0 && (
                                <span className="ml-auto bg-amber-400 text-slate-900 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                                    {stats.pendingOrders}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={() => {
                            logout();
                            navigate('/');
                        }}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:bg-white/5 hover:text-red-400 transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">logout</span>
                        Déconnexion
                    </button>
                </div>
            </aside>

            {/* ── Main content ── */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top bar */}
                <header className="bg-white border-b border-slate-100 px-4 sm:px-8 py-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 border border-slate-100"
                        >
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <h1 className="font-black text-slate-900 capitalize text-lg sm:text-xl truncate max-w-[150px] sm:max-w-none">
                            {PAGES.find(p => p.key === page)?.label}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-slate-900">Administrateur</p>
                            <p className="text-[11px] text-slate-400">sboutlet.ma</p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center">
                            <span className="material-symbols-outlined text-primary-600 text-[20px]">person</span>
                        </div>
                        <button
                            onClick={() => {
                                logout();
                                navigate('/');
                            }}
                            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 px-3 sm:px-4 py-2 rounded-xl transition-colors font-bold text-[10px] sm:text-xs uppercase tracking-wider shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[16px] hidden sm:inline">logout</span>
                            <span className="sm:inline">Quitter</span>
                            <span className="material-symbols-outlined text-[16px] sm:hidden">logout</span>
                        </button>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-8">
                    {page === 'dashboard' && <Dashboard />}
                    {page === 'products' && <Products />}
                    {page === 'orders' && <Orders />}
                </main>
            </div>
        </div>
    );
};

export default AdminPanel;
