import React from 'react';

const TopBanner = () => {
    const message = "⚠️ PIÈCES UNIQUES SEULEMENT • PAS DE RÉASSORT • PAIEMENT À LA LIVRAISON";

    return (
        <div className="relative w-full overflow-hidden bg-announcement text-white py-2 z-[100] shadow-md border-b border-white/5">
            <div className="flex whitespace-nowrap animate-marquee">
                {[...Array(6)].map((_, i) => (
                    <span key={i} className="text-[10px] font-black uppercase tracking-[0.25em] flex items-center shrink-0">
                        <span className="mx-8">{message}</span>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default TopBanner;

