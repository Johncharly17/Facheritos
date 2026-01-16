import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import ShopProfile from './components/ShopProfile';
import CategorySelector from './components/CategorySelector';
import ServiceList from './components/ServiceList';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import { Service } from './types';
import { SERVICES, COMPANY_INFO } from '@/constants';
// CORRECCIÓN: Agregamos Instagram a la importación
import { Facebook, Instagram } from 'lucide-react';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const filteredServices = useMemo(() => {
    if (selectedCategory === 'Todos') return SERVICES;
    return SERVICES.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  const handleBook = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedService(null), 300);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 w-full pt-[60px] relative z-0">
        <ShopProfile />

        {/* --- BANNER DINÁMICO V-CIOUS --- */}
        <section className="max-w-4xl mx-auto px-4 py-12 relative overflow-visible">
          {/* Etiquetas flotantes "Pop-Up" */}
          <div className="absolute -top-2 -left-2 z-20 bg-[#A855F7] text-white text-[10px] font-black px-3 py-1 rounded-sm rotate-[-12deg] shadow-lg animate-bounce uppercase tracking-tighter">
            Coming-Soon
          </div>
          <div className="absolute -bottom-2 -right-2 z-20 bg-black text-white text-[10px] font-black px-3 py-1 rounded-sm rotate-[12deg] shadow-lg animate-pulse uppercase tracking-tighter">
            Solo en Facheritos
          </div>
          <div className="absolute top-1/2 -right-4 z-20 hidden md:block bg-white text-black border border-black text-[9px] font-bold px-2 py-1 rounded-sm rotate-90 uppercase tracking-widest shadow-md">
            NewMerch
          </div>

          <div className="relative group overflow-hidden rounded-sm bg-black aspect-[16/9] md:aspect-[3/1] shadow-[0_20px_50px_rgba(0,0,0,0.3)] transform transition-all duration-500 hover:scale-[1.02]">
            <img 
              src="https://res.cloudinary.com/dqwslpah7/image/upload/v1768573073/Dise%C3%B1o_sin_t%C3%ADtulo_19_zit9nv.jpg" 
              alt="V-cious Studio" 
              className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[2000ms]"
            />

            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
              <h2 className="text-white text-3xl md:text-5xl font-black tracking-tighter mb-2 italic drop-shadow-2xl animate-in fade-in zoom-in duration-700">
                V-CIOUS
              </h2>
              <p className="text-[#A855F7] text-[10px] md:text-xs mb-6 tracking-[0.4em] uppercase font-black bg-white/10 backdrop-blur-sm px-4 py-1 rounded-full">
                The Merch Edition
              </p>
            </div>

            {/* Enlaces Sociales con el link nuevo de V-cious */}
            <div className="absolute bottom-4 left-4 flex gap-3 z-30">
              <a 
                href="https://www.facebook.com/profile.php?id=61586387832244" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-[#A855F7] hover:scale-110 transition-all duration-300 border border-white/30 shadow-lg"
              >
                <Facebook size={18} />
              </a>
              <a 
                href={COMPANY_INFO.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-[#A855F7] hover:scale-110 transition-all duration-300 border border-white/30 shadow-lg"
              >
                <Instagram size={18} />
              </a>
            </div>

            <div className="absolute bottom-4 right-4">
                <span className="text-white/40 text-[8px] font-bold uppercase tracking-[0.2em] italic">
                    Designed by Dimotic
                </span>
            </div>
          </div>
        </section>

        <CategorySelector 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
        
        <div className="relative z-10">
            <ServiceList 
              services={filteredServices} 
              onBook={handleBook} 
            />
        </div>
      </main>

      <Footer />

      {selectedService && (
        <BookingModal 
          service={selectedService}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};
export default App;
