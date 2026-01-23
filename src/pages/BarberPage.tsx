import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import ShopProfile from './components/ShopProfile';
import CategorySelector from './components/CategorySelector';
import ServiceList from './components/ServiceList';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import { Service } from './types';
import { SERVICES, COMPANY_INFO } from '@/constants';
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

        {/* --- BANNER MINIMALISTA V-CIOUS --- */}
        <section className="max-w-4xl mx-auto px-4 py-12">
          <div className="relative group overflow-hidden rounded-sm bg-black aspect-[16/9] md:aspect-[3/1] shadow-2xl">
            {/* Imagen de fondo limpia */}
            <img 
              src="https://res.cloudinary.com/dqwslpah7/image/upload/v1768573073/Dise%C3%B1o_sin_t%C3%ADtulo_19_zit9nv.jpg" 
              alt="V-cious Studio" 
              className="w-full h-full object-cover opacity-50 transition-opacity duration-500 group-hover:opacity-40"
            />

            {/* Texto Principal con Efecto Neón */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
              <h2 className="text-white text-3xl md:text-6xl font-black tracking-tighter italic animate-neon">
                ¡Espéralo Pronto!
              </h2>
              <p className="text-gray-400 text-[10px] md:text-sm mt-4 tracking-[0.2em] uppercase font-bold">
                Estilo V-cious solo en Facheritos Barber shop
              </p>
            </div>

            {/* Iconos Sociales en esquinas inferiores */}
            <div className="absolute bottom-6 left-6 flex gap-4 z-30">
              <a 
                href="https://www.facebook.com/profile.php?id=61586387832244" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-[#A855F7] transition-all transform hover:scale-125"
              >
                <Facebook size={24} strokeWidth={1.5} />
              </a>
              <a 
                href="https://www.instagram.com/vcious.tam/"
                target="_blank" 
                rel="noopener noreferrer"
                className="text-white hover:text-[#A855F7] transition-all transform hover:scale-125"
              >
                <Instagram size={24} strokeWidth={1.5} />
              </a>
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
