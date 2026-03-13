import React from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useAdmin } from '../context/AdminContext';

const Home = () => {
    const navigate = useNavigate();
    const { availableProducts } = useAdmin();
    // Show first 4 available products as best sellers
    const bestSellers = availableProducts.slice(0, 4);
    const fmt = (n) => n ? `${Number(n).toLocaleString('fr-FR')} DH` : null;

    return (
        <div className="bg-white dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
            {/* Hero Section */}
            <section className="relative h-[calc(100vh-80px)] w-full overflow-hidden bg-slate-900">
                <div className="absolute inset-0">
                    <img
                        className="w-full h-full object-cover opacity-60"
                        alt="Luxury Fashion Hero"
                        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent"></div>
                </div>
                <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center">
                    <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary text-sm font-bold tracking-widest uppercase rounded-full mb-6 backdrop-blur-md border border-primary/30">
                        Outlet de Luxe : Jusqu'à -70%
                    </span>
                    <h1 className="text-4xl md:text-8xl font-black text-white leading-[1.1] mb-8 tracking-tighter uppercase italic px-4">
                        L'Élégance<br />
                        <span className="text-primary">Redéfinie</span>
                    </h1>
                    <p className="max-w-2xl text-lg md:text-xl text-slate-300 mb-12 font-medium">
                        Vêtements vintage triés sur le volet et accessoires uniques. <br />
                        Une seconde vie pour des marques intemporelles à Casablanca.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        <button onClick={() => navigate('/femme')} className="bg-primary hover:bg-primary/90 text-white px-12 py-5 rounded-2xl font-black uppercase text-sm tracking-wider shadow-2xl shadow-primary/40 transition-all transform hover:-translate-y-1">
                            Découvrir la Collection
                        </button>
                        <a
                            href="https://www.instagram.com/sb_outlet_dv/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 px-12 py-5 rounded-2xl font-black uppercase text-sm tracking-wider flex items-center justify-center gap-3 transition-all transform hover:-translate-y-1"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.337 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.351-.2 6.78-2.618 6.98-6.98.058-1.28.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.352-2.612-6.78-6.98-6.98-1.28-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                            Instagram
                        </a>
                    </div>
                </div>
            </section>

            {/* About & Drop System Section */}
            <section className="py-24 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1">
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter uppercase italic leading-[1.1]">
                                Le Vintage,<br />
                                <span className="text-primary">Réinventé.</span>
                            </h2>
                            <div className="space-y-6 text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                <p>
                                    Chez <span className="text-slate-900 dark:text-white font-bold">SB Outlet</span>, nous donnons une seconde vie aux pièces d'exception. Notre mission est de rendre le luxe accessible à travers une sélection rigoureuse de grandes marques vintage.
                                </p>
                                <p>
                                    Chaque article est authentifié par nos experts et soigneusement préparé pour garantir une qualité irréprochable. Nous croyons en une mode durable, où le style intemporel prime sur l'éphémère.
                                </p>
                            </div>
                        </div>

                        <div className="lg:w-1/3 w-full">
                            <div className="bg-white dark:bg-slate-800 p-8 rounded-[2rem] shadow-2xl shadow-primary/10 border border-primary/10 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-125 transition-transform duration-500">
                                    <span className="material-symbols-outlined text-6xl text-primary">local_fire_department</span>
                                </div>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-primary text-xl">local_fire_department</span>
                                    </div>
                                    <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-sm">Le Système des Drops</h3>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                                    Notre approche est unique : nous fonctionnons par <span className="text-primary font-bold">"Drops" exclusifs</span>. Chaque sélection est limitée et hautement convoitée.
                                </p>
                                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Attention</p>
                                    <p className="text-xs text-slate-600 dark:text-slate-300 font-bold italic">
                                        "Une fois qu'une pièce est vendue, elle disparaît à jamais. Premier arrivé, premier servi."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <div className="bg-white dark:bg-background-dark py-12 border-y border-slate-100 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <FeatureItem icon="local_shipping" title="Livraison Rapide" desc="Partout au Maroc" />
                        <FeatureItem icon="workspace_premium" title="Qualité Premium" desc="Articles de luxe authentiques" />
                        <FeatureItem icon="verified" title="Service Client" desc="À votre écoute 7j/7" />
                        <FeatureItem icon="support_agent" title="Assistance WhatsApp" desc="Commande simple et rapide" />
                    </div>
                </div>
            </div>

            {/* How it Works Section */}
            <section className="py-24 bg-white dark:bg-background-dark">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight uppercase italic mb-4">Comment ça marche ?</h2>
                        <div className="w-20 h-1.5 bg-primary mx-auto rounded-full"></div>
                    </div>

                    <div className="relative">
                        {/* Timeline Line */}
                        <div className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800 -translate-x-1/2 hidden md:block"></div>

                        <div className="space-y-12 relative">
                            <StepItem
                                number="01"
                                icon="notifications_active"
                                title="Restez Prêts"
                                desc="Abonnez-vous ou suivez notre actualité pour être averti du prochain drop exclusif."
                                side="left"
                            />
                            <StepItem
                                number="02"
                                icon="rocket_launch"
                                title="Lancement du Drop"
                                desc="Le jour J, les nouvelles pièces sont mises en ligne. Soyez réactifs !"
                                side="right"
                            />
                            <StepItem
                                number="03"
                                icon="search_check"
                                title="Explorez & Choisissez"
                                desc="Naviguez parmi notre sélection authentifiée et trouvez votre perle rare."
                                side="left"
                            />
                            <StepItem
                                number="04"
                                icon="shopping_cart_checkout"
                                title="Commandez"
                                desc="Validez votre commande en quelques clics. Paiement à la livraison."
                                side="right"
                            />
                            <StepItem
                                number="05"
                                icon="local_shipping"
                                title="Livraison Express"
                                desc="Recevez votre pièce de luxe directement chez vous, partout au Maroc."
                                side="left"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Best Sellers */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase italic">Derniers Drops</h2>
                            <p className="text-slate-500 mt-2 font-medium">Sélection exclusive de pièces uniques, curatées pour vous.</p>
                        </div>
                        <button onClick={() => navigate('/femme')} className="text-primary font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 group hover:text-primary/80 transition-colors">
                            Voir toute la collection
                            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        {bestSellers.map(product => (
                            <ProductCard
                                key={product.id}
                                {...product}
                                price={fmt(product.price)}
                                oldPrice={fmt(product.oldPrice)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="bg-slate-900 py-32 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" alt="bg" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter italic">Prêt à trouver votre pièce unique ?</h2>
                    <p className="text-slate-400 mb-12 text-lg max-w-2xl mx-auto">Les meilleures pièces partent vite. Ne laissez pas passer l'occasion de posséder l'exceptionnel.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                        <button onClick={() => navigate('/femme')} className="w-full sm:w-auto bg-white text-slate-900 px-12 py-5 rounded-2xl font-black uppercase text-sm tracking-wider transition-all hover:bg-slate-100 min-w-[260px]">
                            Découvrir nos Collections
                        </button>
                        <a className="w-full sm:w-auto bg-[#25d366] text-white px-12 py-5 rounded-2xl font-black uppercase text-sm tracking-wider flex items-center justify-center gap-2 transition-all hover:bg-[#20bd5c] min-w-[260px] shadow-xl shadow-[#25d366]/20" href={`https://wa.me/${process.env.REACT_APP_WHATSAPP_NUMBER}`}>
                            Contactez-nous sur WhatsApp
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
};

const StepItem = ({ number, icon, title, desc, side }) => (
    <div className={`flex flex-col md:flex-row items-center gap-8 ${side === 'right' ? 'md:flex-row-reverse' : ''}`}>
        <div className="flex-1 w-full md:text-right text-left px-12 order-2 md:order-1">
            <div className={`${side === 'right' ? 'md:text-left' : 'md:text-right'} transform transition-all hover:scale-105 duration-300`}>
                <span className="text-primary font-black text-sm tracking-widest">{number}</span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic mt-1 mb-3">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed max-w-sm ml-0 md:ml-auto mr-0 md:mr-auto lg:mr-0 inline-block">{desc}</p>
            </div>
        </div>

        <div className="relative z-10 w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-xl border border-slate-100 dark:border-slate-700 shrink-0 order-1 md:order-2">
            <span className="material-symbols-outlined text-primary text-2xl">{icon}</span>
        </div>

        <div className="flex-1 hidden md:block order-3"></div>
    </div>
);

const FeatureItem = ({ icon, title, desc }) => (
    <div className="flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-primary shadow-sm">
            <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        <div>
            <h3 className="font-extrabold text-sm uppercase tracking-tight italic">{title}</h3>
            <p className="text-xs text-slate-500 mt-1">{desc}</p>
        </div>
    </div>
);

export default Home;
