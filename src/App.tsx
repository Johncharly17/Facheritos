import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import ShopProfile from './components/ShopProfile';
import CategorySelector from './components/CategorySelector';
import ServiceList from './components/ServiceList';
import Footer from './components/Footer';
import BookingModal from './components/BookingModal';
import { Service } from './types';
import { SERVICES } from './constants';

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
        
        <CategorySelector 
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
        
        <ServiceList 
          services={filteredServices} 
          onBook={handleBook} 
        />
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