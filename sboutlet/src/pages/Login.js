import React, { useState } from 'react';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { login, currentUser } = useAuth();
    const navigate = useNavigate();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (currentUser) {
        return <Navigate to={currentUser.role === 'admin' ? '/admin' : '/'} replace />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const res = await login(identifier, password);

        if (res.success) {
            navigate(res.role === 'admin' ? '/admin' : '/');
        } else {
            setError(res.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-display relative">
            {/* Back Button */}
            <Link
                to="/"
                className="absolute top-6 left-6 flex items-center gap-2 text-slate-500 hover:text-primary transition-colors group"
            >
                <div className="w-10 h-10 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:border-primary/20 group-hover:bg-primary/5">
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                </div>
                <span className="text-sm font-bold hidden sm:block">Retour à l'accueil</span>
            </Link>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link to="/" className="flex justify-center mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary-500/30">
                        <span className="material-symbols-outlined text-white text-[24px]">storefront</span>
                    </div>
                </Link>
                <h2 className="text-center text-3xl font-black text-slate-900 tracking-tight">Connexion</h2>
                <p className="mt-2 text-center text-sm text-slate-500">
                    Ou <Link to="/register" className="font-bold text-primary hover:text-primary-600">créez un compte gratuitement</Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100">
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                Email ou Identifiant
                            </label>
                            <input
                                type="text"
                                required
                                value={identifier}
                                onChange={e => setIdentifier(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all font-medium text-slate-900"
                                placeholder="votre@email.com"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all font-medium text-slate-900"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="rounded-xl bg-red-50 p-4 border border-red-100">
                                <div className="flex">
                                    <span className="material-symbols-outlined text-red-400 text-[18px]">error</span>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-bold text-red-800">{error}</h3>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3.5 px-4 rounded-xl shadow-lg shadow-primary-500/30 text-sm font-bold text-white bg-primary hover:bg-primary-600 active:scale-95 transition-all uppercase tracking-wider disabled:opacity-70 gap-2 items-center"
                        >
                            {loading && <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>}
                            {loading ? 'Connexion en cours...' : 'Se connecter'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
