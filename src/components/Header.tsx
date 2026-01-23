import React from 'react';
import { Instagram, Facebook, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import { COMPANY_INFO } from '../constants';

const Header: React.FC = () => {
  // Imagen de tu spot neón con las playeras V-cious
  const spotImageUrl = "https://res.cloudinary.com/dqwslpah7/image/upload/v1769099173/spot_real_shxxxz.jpg";

  return (
    <header className="fixed top-0 left-0 h-screen w-0 md:w-64 bg-black z-50 overflow-hidden border-r border-white/10 hidden md:flex flex-col">
      {/* Fondo con la imagen del spot */}
      <div className="absolute inset-0 z-0">
        <img 
          src={spotImageUrl} 
          alt="V-cious Spot" 
          className="h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/90" />
      </div>

      {/* Contenido del Sidebar */}
      <div className="relative z-10 flex flex-col h-full p-6 justify-between">
        {/* Logo y Título */}
        <div>
          <h1 className="text-white font-black text-3xl tracking-tighter italic leading-none mb-2">
            V-CIOUS
          </h1>
          <p className="text-[#A855F7] text-[10px] font-bold uppercase tracking-widest">
            Urban Racing Spot
          </p>
        </div>

        {/* Botón Central de Navegación */}
        <div className="flex flex-col gap-4">
          <Link 
            to="/v-cious" 
            className="group relative flex items-center justify-center gap-2 bg-white text-black font-bold py-4 px-2 rounded-sm text-xs uppercase tracking-widest hover:bg-[#A855F7] hover:text-white transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            <LayoutGrid size={16} className="group-hover:rotate-90 transition-transform duration-500" />
            Ver Productos Vicious
          </Link>
          <p className="text-gray-400 text-[9px] text-center uppercase tracking-tighter italic">
            Merch exclusiva en Facheritos
          </p>
        </div>

        {/* Redes Sociales y Ubicación */}
        <div className="space-y-6">
          <div className="flex justify-center gap-6">
            <a 
              href="https://www.facebook.com/profile.php?id=61586387832244" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-[#A855F7] transform hover:scale-125 transition-all"
            >
              <Facebook size={24} strokeWidth={1.5} />
            </a>
            <a 
              href="https://www.instagram.com/vcious.tam/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-[#A855F7] transform hover:scale-125 transition-all"
            >
              <Instagram size={24} strokeWidth={1.5} />
            </a>
          </div>
          
          <div className="pt-6 border-t border-white/10">
            <p className="text-white/40 text-[8px] font-bold uppercase tracking-[0.2em] text-center">
              Tampico Cañada, MX
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
