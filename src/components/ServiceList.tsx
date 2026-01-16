import React from 'react';
import { Service } from '../types';

interface ServiceListProps {
  services: Service[];
  onBook: (service: Service) => void;
}

const ServiceList: React.FC<ServiceListProps> = ({ services, onBook }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-24">
      <div className="flex flex-col gap-6">
        {services.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
                <p>No se encontraron servicios en esta categoría.</p>
            </div>
        ) : (
            services.map((service) => (
            <div 
                key={service.id} 
                className="group flex flex-col sm:flex-row bg-white overflow-hidden border-b border-gray-100 pb-6 last:border-0"
            >
                {/* Mobile: Image on top, Desktop: Image on left (optional, prompt implied strict list, but lets add image thumbnail for premium feel) */}
                <div className="flex gap-4 w-full items-center">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 overflow-hidden rounded-sm bg-gray-100">
                        <img 
                            src={service.image} 
                            alt={service.name}
                            loading="lazy"
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-center">
                        <h3 className="font-bold text-base sm:text-lg leading-tight mb-1">{service.name}</h3>
                        <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">{service.duration}</p>
                    </div>

                    <div className="flex flex-col items-end justify-center gap-2 pl-2">
                        <span className="font-bold text-lg">${service.price}</span>
                      <button
                          onClick={() => onBook(service)}
                          className="bg-black text-white text-xs font-bold px-5 py-2.5 rounded-sm hover:bg-[#A855F7] transition-colors duration-300 uppercase tracking-widest min-w-[100px]"
                        >
                          {service.category === 'Productos' ? 'Comprar' : 'Agendar'}
                        </button>
                    </div>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default ServiceList;
