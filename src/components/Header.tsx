import React, { useState, useEffect } from 'react';
import { Instagram, Facebook } from 'lucide-react';
import { COMPANY_INFO } from '../constants';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  // El link de Cloudinary que usas en n8n
  const logoUrl = "https://res.cloudinary.com/dqwslpah7/image/upload/v1767630935/logo_jlydai.jpg";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-sm border-b border-gray-100 py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
        {/* Logo Area */}
        <div className="flex items-center gap-3">
            <div className={`overflow-hidden rounded-full border-2 border-black transition-all duration-300 ${scrolled ? 'h-10 w-10' : 'h-12 w-12'}`}>
              <img 
                src={logoUrl} 
                alt="Logo Facheritos" 
                className="h-full w-full object-cover"
              />
            </div>
            <span className={`font-bold tracking-tighter text-xl transition-colors duration-300 ${scrolled ? 'text-black' : 'text-black'}`}>
                FACHERITOS
            </span>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4">
          <a 
            href={COMPANY_INFO.instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-black hover:text-[#A855F7] transition-all duration-300 hover:scale-110"
          >
            <Instagram size={22} strokeWidth={1.5} />
          </a>
          <a 
            href={COMPANY_INFO.facebook} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-black hover:text-[#A855F7] transition-all duration-300 hover:scale-110"
          >
            <Facebook size={22} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;