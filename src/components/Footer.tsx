import React from 'react';
import { MapPin, Clock, ExternalLink } from 'lucide-react';
import { COMPANY_INFO } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-10 mt-auto">
      <div className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div>
                <h4 className="font-bold text-lg mb-4">Ubicación</h4>
                <div className="flex items-start gap-3 mb-4 text-gray-600">
                    <MapPin className="mt-1 flex-shrink-0 text-[#A855F7]" size={20} />
                    <p>{COMPANY_INFO.address}</p>
                </div>
                <a 
                    href={COMPANY_INFO.mapsUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-[#A855F7] hover:border-[#A855F7] transition-colors"
                >
                    Ver en Google Maps <ExternalLink size={12} />
                </a>
            </div>

            <div>
                <h4 className="font-bold text-lg mb-4">Horarios</h4>
                <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="flex-shrink-0 text-[#A855F7]" size={20} />
                    <p>{COMPANY_INFO.hours}</p>
                </div>
            </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-400">© {new Date().getFullYear()} Facheritos Barber Shop. Developed with minimalist precision.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;