import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import { useAdmin } from '../context/AdminContext';

const Homme = () => {
    const { fetchProductsPage } = useAdmin();
    const [pageData, setPageData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPrice, setMaxPrice] = useState(10000);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const res = await fetchProductsPage(currentPage, {
                category: 'Homme',
                max_price: maxPrice,
                in_stock: 'true'
            });
            setPageData(res);
            setLoading(false);
        };
        load();
    }, [currentPage, maxPrice]);

    const products = pageData?.data || [];
    const totalPages = pageData?.last_page || 1;

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            <main className="flex-grow">
                <section className="relative h-[400px] w-full overflow-hidden bg-slate-900 flex items-center">
                    <div className="absolute inset-0">
                        <img className="w-full h-full object-cover opacity-70" alt="Collection Homme Hero" src="https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2070&auto=format&fit=crop" />
                        <div className="absolute inset-0 bg-gradient-to-r from-background-dark via-background-dark/40 to-transparent"></div>
                    </div>
                    <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                        <span className="inline-block px-4 py-1.5 bg-primary/90 text-white text-[10px] font-black tracking-[0.2em] uppercase mb-6 rounded-full shadow-lg">Style Classique & Moderne</span>
                        <h1 className="text-4xl md:text-7xl font-black text-white mb-6 uppercase tracking-tighter">Collection<br /><span className="text-primary-400">Homme</span></h1>
                        <p className="max-w-md text-slate-200 text-lg leading-relaxed font-medium">L'essence de l'élégance masculine. Des pièces de créateurs pour une allure impeccable.</p>
                    </div>
                </section>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col lg:flex-row gap-12">
                        <aside className="w-full lg:w-72 space-y-8 shrink-0">
                            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 sticky top-28">
                                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary mb-8 italic">Votre Budget</h3>

                                <div className="space-y-8">
                                    <div>
                                        <div className="flex justify-between items-end mb-4">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Max :</span>
                                            <span className="text-2xl font-black text-primary-700 tracking-tight">
                                                {Number(maxPrice).toLocaleString('fr-FR')} DH
                                            </span>
                                        </div>

                                        <input
                                            type="range"
                                            min="0"
                                            max="10000"
                                            step="100"
                                            value={maxPrice}
                                            onChange={(e) => {
                                                setMaxPrice(Number(e.target.value));
                                                setCurrentPage(1);
                                            }}
                                            className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                        />

                                        <div className="flex justify-between mt-3 px-1">
                                            <span className="text-[9px] font-bold text-slate-300">0 DH</span>
                                            <span className="text-[9px] font-bold text-slate-300">10 000 DH</span>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <p className="text-[10px] text-slate-400 leading-relaxed">
                                            Affiche les produits de <span className="text-slate-900 font-bold dark:text-white">0 DH</span> à <span className="text-primary-600 font-bold">{Number(maxPrice).toLocaleString('fr-FR')} DH</span>.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        <div className="flex-1">
                            {loading ? (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
                                    {[1, 2, 3, 4, 5, 6].map(i => (
                                        <div key={i} className="bg-white rounded-[2rem] aspect-[4/5] shadow-sm shadow-slate-100" />
                                    ))}
                                </div>
                            ) : products.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-32 text-slate-400 bg-white dark:bg-slate-800 rounded-[3rem] border border-dashed border-slate-200 dark:border-slate-700">
                                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center mb-6">
                                        <span className="material-symbols-outlined text-4xl text-slate-300">search_off</span>
                                    </div>
                                    <p className="font-bold text-slate-900 dark:text-white uppercase text-xs tracking-widest mb-2">Aucun résultat</p>
                                    <p className="text-sm font-medium">Essayez d'augmenter votre budget maximum.</p>
                                    <button
                                        onClick={() => { setMaxPrice(10000); setCurrentPage(1); }}
                                        className="mt-8 text-primary font-black uppercase text-[10px] tracking-widest hover:underline"
                                    >
                                        Réinitialiser le filtre
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                                        {products.map(p => (
                                            <ProductCard
                                                key={p.id}
                                                {...p}
                                                price={p.price}
                                                oldPrice={p.oldPrice}
                                            />
                                        ))}
                                    </div>
                                    <Pagination
                                        current={currentPage}
                                        last={totalPages}
                                        onPageChange={(p) => {
                                            setCurrentPage(p);
                                            window.scrollTo({ top: 350, behavior: 'smooth' });
                                        }}
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Homme;
