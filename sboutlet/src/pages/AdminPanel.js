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
    const [page, setPage] = useState('dashboard'); // This seems unused locally but keeping it if needed

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-black text-slate-900 mb-1">Tableau de bord</h2>
                <p className="text-sm text-slate-500">Vue d'ensemble de votre boutique</p>
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon="paid" label="Ventes" value={`${stats.totalRevenue.toLocaleString('fr-FR')} DH`} sub="Livrées" color="#da0b3f" />
                <StatCard icon="pending_actions" label="À traiter" value={stats.pendingOrders} sub="En attente" color="#da0b3f" />
                <StatCard icon="task_alt" label="Livrées" value={orders.filter(o => o.status === 'Livré').length} sub="Terminées" color="#059669" />
                <StatCard icon="inventory_2" label="Produits" value={stats.totalProducts} sub="En ligne" color="#be0a37" />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-black text-slate-900">Commandes récentes</h3>
                </div>

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
                                                className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 text-slate-600 focus:outline-none font-semibold"
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
            </div>
        </div>
    );
};

/* ── Product form modal ──────────────────────────────────────── */
const ProductModal = ({ product = null, onClose, afterSave }) => {
    const { addProduct, updateProduct, deleteGalleryImage } = useAdmin();
    const [form, setForm] = useState(product || EMPTY_PRODUCT);

    const set = (k, v) => {
        const rule = NON_NEGATIVE_FIELDS[k];
        if (rule && v !== '') {
            const numericValue = Number(v);
            if (!Number.isNaN(numericValue)) {
                if (numericValue < rule.min) v = String(rule.min);
                else if (rule.max !== undefined && numericValue > rule.max) v = String(rule.max);
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

    const removeImage = (index, isExisting = false) => {
        if (isExisting) {
            setForm(prev => ({ ...prev, image: null, main_image: null }));
        } else {
            setForm(prev => {
                const newFiles = (prev.imageFiles || []).filter((_, i) => i !== index);
                return { ...prev, imageFiles: newFiles };
            });
        }
    };

    const submit = async (e) => {
        e.preventDefault();
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
            form.imageFiles.forEach((file) => formData.append('images[]', file));
        } else if (!form.image && product) {
            formData.append('main_image_clear', 'true');
        }

        const res = product ? await updateProduct(product.id, formData) : await addProduct(formData);
        if (res.success) {
            await afterSave?.(product ? 'update' : 'create');
            onClose();
        } else alert(res.error);
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h3 className="font-black text-slate-900">{product ? 'Modifier' : 'Ajouter'}</h3>
                    <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200">
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
                                <label className="text-xs font-bold text-slate-400 block mb-1">{label}</label>
                                <input
                                    type={type}
                                    value={form[key] ?? ''}
                                    onChange={e => set(key, e.target.value)}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary"
                                    required={['name', 'price'].includes(key)}
                                />
                            </div>
                        ))}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 block mb-2">Images (Max 4)</label>
                        <div className="grid grid-cols-4 gap-2">
                            {/* Main Image */}
                            {product && form.image && (
                                <div className="relative aspect-square rounded-xl border overflow-hidden">
                                    <img src={form.image} className="w-full h-full object-cover" alt="current" />
                                    <button type="button" onClick={() => removeImage(0, true)} className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[14px]">delete</span>
                                    </button>
                                    <div className="absolute inset-x-0 bottom-0 bg-black/50 py-1 text-[8px] text-white text-center font-bold">PRINCIPALE</div>
                                </div>
                            )}

                            {/* Gallery Images */}
                            {product && product.images && product.images.map((imgObj, idx) => (
                                <div key={`existing-${idx}`} className="relative aspect-square rounded-xl border overflow-hidden group">
                                    <img src={imgObj.url} className="w-full h-full object-cover" alt="gallery" />
                                    <button 
                                        type="button" 
                                        onClick={async () => {
                                            if(window.confirm('Supprimer cette image de la galerie ?')) {
                                                await deleteGalleryImage(imgObj.id);
                                            }
                                        }} 
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <span className="material-symbols-outlined text-[14px]">delete</span>
                                    </button>
                                </div>
                            ))}

                            {/* New Files Preview */}
                            {(form.imageFiles || []).map((file, idx) => (
                                <div key={idx} className="relative aspect-square rounded-xl border overflow-hidden">
                                    <img src={URL.createObjectURL(file)} alt="preview" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-[12px]">close</span>
                                    </button>
                                </div>
                            ))}
                            {((form.imageFiles || []).length + (form.image ? 1 : 0) + (product?.images?.length || 0)) < 4 && (
                                <label className="aspect-square rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-slate-50">
                                    <input type="file" multiple onChange={handleImageUpload} className="hidden" />
                                    <span className="material-symbols-outlined text-slate-400">add_a_photo</span>
                                </label>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 block mb-1">Description</label>
                        <textarea
                            value={form.description || ''}
                            onChange={e => set('description', e.target.value)}
                            rows="3"
                            className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary resize-none"
                            required
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <select value={form.category} onChange={e => set('category', e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm">
                            {CATEGORY_OPTIONS.map(c => <option key={c}>{c}</option>)}
                        </select>
                        <select value={form.condition} onChange={e => set('condition', e.target.value)} className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm">
                            {CONDITION_OPTIONS.map(c => <option key={c}>{c}</option>)}
                        </select>
                    </div>

                    <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-600 transition-colors">
                        {product ? 'Enregistrer' : 'Ajouter'}
                    </button>
                </form>
            </div>
        </div>
    );
};

/* ── Section: Products management ────────────────────────────── */
const Products = () => {
    const { pagination, fetchProductsPage, deleteProduct, stats } = useAdmin();
    const [modal, setModal] = useState(null);
    const [search, setSearch] = useState('');
    const [catFilter, setCatFilter] = useState('Tous');

    useEffect(() => {
        fetchProductsPage(1, { category: catFilter, in_stock: 'false' });
    }, [catFilter]);

    const handlePageChange = (p) => fetchProductsPage(p, { category: catFilter, in_stock: 'false' });
    const handleProductSaved = async (mode) => {
        const targetPage = mode === 'create' ? 1 : (pagination?.current_page || 1);
        await fetchProductsPage(targetPage, { category: catFilter, in_stock: 'false' });
    };

    const displayList = pagination?.data || [];
    const filtered = displayList.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {modal && <ProductModal product={modal === 'add' ? null : modal} onClose={() => setModal(null)} afterSave={handleProductSaved} />}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black text-slate-900">Produits</h2>
                <button onClick={() => setModal('add')} className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold shadow-md">Ajouter</button>
            </div>
            <div className="flex gap-4">
                <input type="text" placeholder="Rechercher…" value={search} onChange={e => setSearch(e.target.value)} className="flex-1 border rounded-xl px-4 py-2" />
                <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="border rounded-xl px-4 py-2">
                    {['Tous', ...CATEGORY_OPTIONS].map(c => <option key={c}>{c}</option>)}
                </select>
            </div>
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead><tr className="bg-slate-50 text-left px-5 font-bold"><th>Produit</th><th>Stock</th><th>Prix</th><th>Actions</th></tr></thead>
                    <tbody className="divide-y">
                        {filtered.map(p => (
                            <tr key={p.id} className="hover:bg-slate-50">
                                <td className="p-4 flex items-center gap-3">
                                    <img src={p.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                                    <div><p className="font-bold">{p.name}</p><p className="text-xs text-slate-400">{p.brand}</p></div>
                                </td>
                                <td className="p-4">{p.stock}</td>
                                <td className="p-4 font-bold">{p.price} DH</td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => setModal(p)} className="text-primary-600">Modifier</button>
                                    <button onClick={() => deleteProduct(p.id)} className="text-red-500">Supprimer</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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
            <h2 className="text-2xl font-black text-slate-900">Commandes</h2>
            <div className="flex gap-2">
                {['Tous', ...STATUS_OPTIONS].map(s => (
                    <button key={s} onClick={() => setStatusFilter(s)} className={`px-4 py-2 rounded-full text-xs font-bold ${statusFilter === s ? 'bg-primary text-white' : 'bg-white border'}`}>{s}</button>
                ))}
            </div>
            <div className="space-y-4">
                {filtered.map(order => (
                    <div key={order.id} className="bg-white rounded-2xl border p-6">
                        <div className="flex justify-between mb-4">
                            <span className="font-bold text-primary-600">#{order.id}</span>
                            <select value={order.status} onChange={e => updateOrderStatus(order.id, e.target.value)} className="text-xs border rounded-lg px-2 py-1">
                                {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="text-sm">
                            <p className="font-bold">{order.customer}</p>
                            <p>{order.phone} • {order.city}</p>
                            <div className="mt-2 border-t pt-2">
                                {order.items.map((it, i) => <div key={i} className="flex justify-between"><span>{it.name} x{it.qty}</span><span className="font-bold">{it.price} DH</span></div>)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AdminPanel = () => {
    const { stats, refreshData } = useAdmin();
    const { currentUser, logout, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [page, setPage] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => { refreshData(); }, []);

    if (authLoading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>;
    if (!currentUser || currentUser.role !== 'admin') return <Navigate to="/" replace />;

    return (
        <div className="min-h-screen bg-[#F4F5F9] flex">
            <aside className={`fixed inset-y-0 left-0 z-[150] w-64 bg-slate-900 flex flex-col transition-transform lg:translate-x-0 lg:static ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-white/10 text-white font-black">SBOutlet Admin</div>
                <nav className="flex-1 p-4 space-y-1">
                    {PAGES.map(pg => (
                        <button key={pg.key} onClick={() => setPage(pg.key)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${page === pg.key ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}`}>
                            <span className="material-symbols-outlined">{pg.icon}</span>{pg.label}
                        </button>
                    ))}
                </nav>
                <button onClick={() => { logout(); navigate('/'); }} className="p-4 text-slate-400 hover:text-red-400">Déconnexion</button>
            </aside>
            <div className="flex-1 flex flex-col min-w-0">
                <header className="bg-white border-b p-4 flex items-center justify-between">
                    <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden material-symbols-outlined">menu</button>
                    <h1 className="font-black text-xl">{PAGES.find(p => p.key === page)?.label}</h1>
                    <button onClick={() => navigate('/')} className="text-xs bg-slate-100 px-3 py-1 rounded-lg">Voir Boutique</button>
                </header>
                <main className="p-8">
                    {page === 'dashboard' && <Dashboard />}
                    {page === 'products' && <Products />}
                    {page === 'orders' && <Orders />}
                </main>
            </div>
        </div>
    );
};

const PAGES = [
    { key: 'dashboard', label: 'Tableau de bord', icon: 'dashboard' },
    { key: 'products', label: 'Produits', icon: 'inventory_2' },
    { key: 'orders', label: 'Commandes', icon: 'receipt_long' },
];

export default AdminPanel;
