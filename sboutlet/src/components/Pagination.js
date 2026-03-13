import React from 'react';

const Pagination = ({ current, last, onPageChange }) => {
    if (last <= 1) return null;

    const pages = [];
    for (let i = 1; i <= last; i++) {
        pages.push(i);
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-12 pb-8">
            <button
                disabled={current === 1}
                onClick={() => onPageChange(current - 1)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all disabled:opacity-30 disabled:hover:border-slate-100 disabled:hover:text-slate-400"
            >
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>

            {pages.map(p => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`w-10 h-10 rounded-xl font-black text-xs transition-all border ${current === p
                            ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20'
                            : 'bg-white border-slate-100 text-slate-500 hover:border-primary hover:text-primary'
                        }`}
                >
                    {p}
                </button>
            ))}

            <button
                disabled={current === last}
                onClick={() => onPageChange(current + 1)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all disabled:opacity-30 disabled:hover:border-slate-100 disabled:hover:text-slate-400"
            >
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
        </div>
    );
};

export default Pagination;
