import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import ShopProfile from './components/ShopProfile';
import CategorySelector from './components/CategorySelector';
import ServiceList from './components/ServiceList';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import { Service } from './types';
import { SERVICES } from './constants';
import { Facebook, ExternalLink } from 'lucide-react'; // Asegúrate de tener estos

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // Filter services based on category
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
    // Optional: clear selected service after animation delay if needed
    setTimeout(() => setSelectedService(null), 300);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      
      <main className="flex-1 w-full pt-[60px]">
        <ShopProfile />

        {/* --- NUEVO BANNER V-CIOUS --- */}
        <section className="max-w-4xl mx-auto px-4 py-8">
          <div className="relative group overflow-hidden rounded-sm bg-black aspect-[16/9] md:aspect-[3/1]">
            <img 
              src="https://res.cloudinary.com/dqwslpah7/image/upload/v1768573073/Dise%C3%B1o_sin_t%C3%ADtulo_19_zit9nv.jpg" 
              alt="V-cious Studio" 
              className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6">
              <h2 className="text-white text-2xl md:text-4xl font-black tracking-tighter mb-2 italic">
                PORTA LA MERCH DE V-CIOUS
              </h2>
              <p className="text-gray-300 text-xs md:text-sm mb-4 tracking-widest uppercase">
                Estilo urbano nacido en la barbería
              </p>
              <a 
                href={COMPANY_INFO.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white text-black px-6 py-2 text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-[#A855F7] hover:text-white transition-colors"
              >
                Ver en Facebook <Facebook size={14} />
              </a>
            </div>
          </div>
        </section>

        <CategorySelector 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
        
        {/* El ServiceList ahora mostrará también productos cuando se filtre */}
        <ServiceList 
          services={filteredServices} 
          onBook={handleBook} 
        />
      </main>

      <Footer />
      {/* ... modal logic */}
    </div>
  );
};
export default App;
