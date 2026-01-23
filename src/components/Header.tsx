import React from 'react';
import { Instagram, Facebook, LayoutGrid, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const spotImageUrl = "https://res.cloudinary.com/dqwslpah7/image/upload/v1769099173/spot_real_shxxxz.jpg";

  return (
    <>
      {/* --- VERSIÓN MÓVIL (TOP BAR) --- */}
      <header className="fixed top-0 left-0 right-0 h-[60px] bg-black z-50 flex md:hidden items-center justify-between px-4 border-b border-white/10">
        <Link to="/" className="text-white font-black italic tracking-tighter text-xl">
          V-CIOUS
        </Link>
        <Link 
          to="/v-cious" 
          className="bg-[#A855F7] text-white p-2 rounded-sm flex items-center gap-2 text-[10px] font-bold uppercase"
        >
          <ShoppingCart size={14} /> Tienda
        </Link>
      </header>

      {/* --- VERSIÓN LAPTOP (SIDEBAR VERTICAL) --- */}
      <header className="fixed top-0 left-0 h-screen w-64 bg-black z-50 overflow-hidden border-r border-white/10 hidden md:flex flex-col">
        <div className="absolute inset-0 z-0">
          <img src={spotImageUrl} alt="V-cious Spot" className="h-full w-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90" />
        </div>

        <div className="relative z-10 flex flex-col h-full p-6 justify-between">
          <div>
            <h1 className="text-white font-black text-3xl tracking-tighter italic leading-none mb-2">V-CIOUS</h1>
            <p className="text-[#A855F7] text-[10px] font-bold uppercase tracking-widest text-shadow-sm">Urban Racing Spot</p>
          </div>

          <div className="flex flex-col gap-4">
            <Link to="/v-cious" className="group flex items-center justify-center gap-2 bg-white text-black font-bold py-4 px-2 rounded-sm text-xs uppercase tracking-widest hover:bg-[#A855F7] hover:text-white transition-all duration-300">
              <LayoutGrid size={16} className="group-hover:rotate-90 transition-transform duration-500" />
              Ver Productos Vicious
            </Link>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center gap-6">
              <a href="https://www.facebook.com/profile.php?id=61586387832244" target="_blank" className="text-white hover:text-[#A855F7] transition-all"><Facebook size={24} /></a>
              <a href="https://www.instagram.com/vcious.tam/" target="_blank" className="text-white hover:text-[#A855F7] transition-all"><Instagram size={24} /></a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
