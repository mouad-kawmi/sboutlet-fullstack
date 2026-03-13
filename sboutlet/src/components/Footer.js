import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-white dark:bg-background-dark pt-16 pb-8 border-t border-slate-100 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center text-center">
                    {/* Brand */}
                    <Link to="/" className="flex items-center gap-2 mb-4 group">
                        <span className="material-symbols-outlined text-primary text-2xl group-hover:rotate-12 transition-transform">diamond</span>
                        <h2 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">SB.OUTLET</h2>
                    </Link>

                    <p className="max-w-md text-slate-500 text-sm leading-relaxed mb-8">
                        Vêtements vintage triés sur le volet et accessoires uniques. <br />
                        Une seconde vie pour des marques intemporelles à Casablanca.
                    </p>

                    {/* Quick Nav */}
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-8">
                        <FooterLink to="/homme" label="Homme" />
                        <FooterLink to="/femme" label="Femme" />
                        <FooterLink to="/enfants" label="Enfants" />
                        <FooterLink to="/accessoires" label="Accessoires" />
                    </div>

                    <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-4 mb-10">
                        <div className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                            <span className="material-symbols-outlined text-lg text-primary">call</span>
                            +{process.env.REACT_APP_WHATSAPP_NUMBER}
                        </div>
                        <a href={`https://wa.me/${process.env.REACT_APP_WHATSAPP_NUMBER}`} className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-[#25d366] transition-colors">
                            <span className="material-symbols-outlined text-lg">chat</span>
                            WhatsApp
                        </a>
                        <a href="https://www.instagram.com/sb_outlet_dv/" className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-pink-500 transition-colors">
                            <span className="material-symbols-outlined text-lg">photo_camera</span>
                            Instagram
                        </a>
                    </div>

                    {/* Copyright */}
                    <div className="pt-8 border-t border-slate-50 dark:border-slate-800 w-full">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            © 2024 SB.OUTLET LUXURY — TOUS DROITS RÉSERVÉS.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

const FooterLink = ({ to, label }) => (
    <Link to={to} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-primary transition-colors">
        {label}
    </Link>
);

export default Footer;
