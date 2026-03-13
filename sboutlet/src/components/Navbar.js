import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { setIsCartOpen, cartItems } = useCart();
    const { currentUser, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center gap-10">
                        <Link to="/" className="flex items-center gap-2 cursor-pointer group" onClick={() => setIsMenuOpen(false)}>
                            <span className="material-symbols-outlined text-primary text-2xl group-hover:rotate-12 transition-transform">diamond</span>
                            <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">SB.OUTLET</h1>
                        </Link>

                        <div className="hidden lg:flex items-center gap-6">
                            <NavItem to="/" label="Accueil" active={isActive('/')} />
                            <NavItem to="/homme" label="Homme" active={isActive('/homme')} />
                            <NavItem to="/femme" label="Femme" active={isActive('/femme')} />
                            <NavItem to="/enfants" label="Enfants" active={isActive('/enfants')} />
                            <NavItem to="/accessoires" label="Accessoires" active={isActive('/accessoires')} />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {currentUser ? (
                            <div className="flex items-center gap-3 bg-primary-50 px-3 py-1.5 rounded-full border border-primary-100">
                                <div className="w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-black shadow-sm">
                                    {currentUser.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-xs font-black text-primary-900 tracking-wide uppercase hidden sm:block">
                                    {currentUser.name.split(' ')[0]}
                                </span>
                                {currentUser.role === 'admin' ? (
                                    <Link to="/admin" className="text-primary-600 hover:text-primary-800 transition-colors ml-1" title="Admin Panel">
                                        <span className="material-symbols-outlined text-[18px]">admin_panel_settings</span>
                                    </Link>
                                ) : (
                                    <button onClick={logout} className="text-primary-400 hover:text-red-500 transition-colors ml-1" title="Déconnexion">
                                        <span className="material-symbols-outlined text-[18px]">logout</span>
                                    </button>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-full transition-colors text-xs font-bold uppercase tracking-wide">
                                <span className="material-symbols-outlined text-[18px]">person</span>
                                <span className="hidden sm:inline">Me connecter</span>
                            </Link>
                        )}

                        <a
                            href="https://www.instagram.com/sb_outlet_dv/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hidden sm:flex items-center gap-2 p-2 hover:bg-slate-50 rounded-full transition-all hover:scale-105 text-slate-600 hover:text-pink-600 group"
                            title="Suivez-nous sur Instagram"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.332 3.608 1.308.975.975 1.245 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.332 2.633-1.308 3.608-.975.975-2.242 1.245-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.332-3.608-1.308-.975-.975-1.245-2.242-1.308-3.608-.058-1.266-.07-1.646-.07-4.85s.012-3.584.07-4.85c.062-1.366.332-2.633 1.308-3.608.975-.975 2.242-1.245 3.608-1.308 1.266-.058 1.646-.07 4.85-.07zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948s.014 3.667.072 4.947c.2 4.337 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072s3.667-.014 4.947-.072c4.351-.2 6.78-2.618 6.98-6.98.058-1.28.072-1.689.072-4.948s-.014-3.667-.072-4.947c-.2-4.352-2.612-6.78-6.98-6.98-1.28-.058-1.689-.072-4.948-.072zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                            <span className="hidden xl:inline text-[9px] font-black uppercase tracking-widest">Instagram</span>
                        </a>

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors relative"
                        >
                            <span className="material-symbols-outlined">shopping_cart</span>
                            {cartItems.length > 0 && (
                                <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-bounce">
                                    {cartItems.length}
                                </span>
                            )}
                        </button>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 hover:bg-slate-100 rounded-full transition-colors"
                        >
                            <span className="material-symbols-outlined">{isMenuOpen ? 'close' : 'menu'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`lg:hidden fixed inset-0 z-[150] bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsMenuOpen(false)}
            ></div>

            {/* Mobile Menu Drawer */}
            <div className={`lg:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-200 z-[151] transition-all duration-300 ease-in-out transform shadow-2xl ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0 pointer-events-none'}`}>
                <div className="px-6 py-8 flex flex-col gap-6">
                    <MobileNavItem to="/" label="Accueil" active={isActive('/')} onClick={() => setIsMenuOpen(false)} />
                    <MobileNavItem to="/homme" label="Homme" active={isActive('/homme')} onClick={() => setIsMenuOpen(false)} />
                    <MobileNavItem to="/femme" label="Femme" active={isActive('/femme')} onClick={() => setIsMenuOpen(false)} />
                    <MobileNavItem to="/enfants" label="Enfants" active={isActive('/enfants')} onClick={() => setIsMenuOpen(false)} />
                    <MobileNavItem to="/accessoires" label="Accessoires" active={isActive('/accessoires')} onClick={() => setIsMenuOpen(false)} />
                </div>
            </div>
        </nav>
    );
};

const MobileNavItem = ({ to, label, active, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        className={`text-sm font-black uppercase tracking-widest flex items-center justify-between py-2 border-b border-slate-50 ${active ? 'text-primary' : 'text-slate-900'}`}
    >
        {label}
        <span className="material-symbols-outlined text-[18px] opacity-20">chevron_right</span>
    </Link>
);

const NavItem = ({ to, label, active }) => (
    <Link
        to={to}
        className={`text-[10px] uppercase tracking-[0.2em] font-black transition-all hover:text-primary relative py-2 ${active ? 'text-primary' : 'text-slate-500'}`}
    >
        {label}
        {active && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
        )}
    </Link>
);

export default Navbar;
