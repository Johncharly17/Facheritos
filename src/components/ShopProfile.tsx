import React from 'react';
import { MapPin } from 'lucide-react';
import { COMPANY_INFO } from '../constants';

const ShopProfile: React.FC = () => {
  return (
    <div className="relative w-full">
      {/* Cover Image */}
      <div className="h-64 w-full overflow-hidden relative">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src="https://res.cloudinary.com/dqwslpah7/image/upload/v1766326101/564195194_1412229854245220_1478185233277774777_n_bexwnw.jpg" 
          alt="Barbershop Exterior" 
          className="w-full h-full object-cover"
        />
        
        {/* Profile Content Overlaid on bottom left */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-4xl mx-auto flex justify-between items-end">
             <div className="text-white">
                <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-3xl font-bold tracking-tight">Facheritos</h1>
                    <span className="bg-white/10 backdrop-blur-md border border-[#A855F7] text-[#A855F7] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                        Abierto
                    </span>
                </div>
                <div className="flex items-center gap-1 text-gray-300 text-sm">
                    <MapPin size={14} />
                    <span>{COMPANY_INFO.address}</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopProfile;