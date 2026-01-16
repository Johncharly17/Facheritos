import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import ShopProfile from './components/ShopProfile';
import CategorySelector from './components/CategorySelector';
import ServiceList from './components/ServiceList';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import { Service } from './types';
import { SERVICES, COMPANY_INFO } from '@/constants';
import { Facebook } from 'lucide-react';

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
      
      <main className="flex-1 w-full pt-[60px] relative z-0">
        <ShopProfile />

        <section className="max-w-4xl mx-auto px-4 py-8 relative z-10">
          {/* Banner V-cious */}
          <div className="relative group overflow-hidden rounded-sm bg-black aspect-[16/9] md:aspect-[3/1]">
            <img 
              src="https://res.cloudinary.com/dqwslpah7/image/upload/v1768573073/Dise%C3%B1o_sin_t%C3%ADtulo_19_zit9nv.jpg" 
              className="w-full h-full object-cover opacity-60" 
            />
            {/* ... contenido del banner */}
          </div>
        </section>

        <CategorySelector 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
        
        {/* VITAL: Añadimos 'relative z-10' para que los botones estén "al frente" */}
        <div className="relative z-10">
            <ServiceList 
              services={filteredServices} 
              onBook={handleBook} 
            />
        </div>
      </main>

      <Footer />

      {/* VITAL: El modal debe estar en el Z-index más alto posible */}
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
