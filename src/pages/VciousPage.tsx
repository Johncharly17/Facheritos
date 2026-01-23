// src/pages/VciousPage.tsx
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SERVICES } from '@/constants';
import { ShoppingBag, Zap } from 'lucide-react';

const VciousPage: React.FC = () => {
  const vciousProducts = SERVICES.filter(s => s.id.startsWith('vc') || s.id.startsWith('prod'));
  const spotImageUrl = "https://res.cloudinary.com/dqwslpah7/image/upload/v1769099173/spot_real_shxxxz.jpg";

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Header />
      <main className="flex-1 w-full md:ml-64 relative">
        {/* BACKGROUND: Spot Real con Overlay Púrpura */}
        <div className="fixed inset-0 z-0">
          <img src={spotImageUrl} className="w-full h-full object-cover opacity-30 contrast-125" alt="Spot" />
          <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/80 to-[#A855F7]/10" />
        </div>

        <div className="relative z-10 pt-32 px-6">
          <h1 className="text-7xl md:text-9xl font-black italic text-center tracking-tighter mb-16 drop-shadow-2xl">V-CIOUS</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto pb-20">
            {vciousProducts.map((product) => (
              <div key={product.id} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-sm shadow-2xl">
                <div className="aspect-square overflow-hidden mb-6 bg-black">
                  <img src={product.image} className="w-full h-full object-cover opacity-80" alt={product.name} />
                </div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black italic uppercase">{product.name}</h3>
                  <span className="text-3xl font-black text-[#A855F7] italic">${product.price}</span>
                </div>
                <button className="w-full py-4 bg-white text-black font-black uppercase tracking-widest hover:bg-[#A855F7] hover:text-white transition-all">
                  Asegurar Stock <ShoppingBag size={18} className="inline ml-2" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VciousPage;
