import React, { useState, useMemo } from 'react';
// CORRECCIÓN: Usamos '../' para subir un nivel de carpeta
import Header from '../components/Header';
import ShopProfile from '../components/ShopProfile';
import CategorySelector from '../components/CategorySelector';
import ServiceList from '../components/ServiceList';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import { Service } from '../types';
import { SERVICES, COMPANY_INFO } from '@/constants';
import { Facebook, Instagram } from 'lucide-react';

// CORRECCIÓN: Renombramos el componente a BarberPage
const BarberPage: React.FC = () => {
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
      
      {/* Añadimos md:ml-64 para el nuevo Header Vertical que creamos */}
      <main className="flex-1 w-full pt-[60px] md:pt-0 md:ml-64 relative z-0">
        <ShopProfile />

        {/* --- BANNER MINIMALISTA V-CIOUS --- */}
        <section className="max-w-4xl mx-auto px-4 py-12">
          {/* ... tu código del banner actual ... */}
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

export default BarberPage;
