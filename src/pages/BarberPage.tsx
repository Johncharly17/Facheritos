import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import ShopProfile from '../components/ShopProfile';
import CategorySelector from '../components/CategorySelector';
import ServiceList from '../components/ServiceList';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal';
import { Service } from '../types';
import { SERVICES, COMPANY_INFO } from '@/constants';
import { Facebook, Instagram } from 'lucide-react';

// src/pages/BarberPage.tsx
const BARBER_CATEGORIES = ['Cortes', 'Combos', 'Barba', 'Faciales'];

const BarberPage: React.FC = () => {
  // CORRECCIÓN: Un solo valor inicial
  const [selectedCategory, setSelectedCategory] = useState('Cortes');
  
  // Filtro para que solo aparezcan servicios de barbería
  const filteredServices = useMemo(() => {
    const onlyBarber = SERVICES.filter(s => s.category !== 'Productos');
    return onlyBarber.filter((s) => s.category === selectedCategory);
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
      <main className="flex-1 w-full md:ml-64 pt-[60px] md:pt-0 relative z-0">
        <ShopProfile />
        <CategorySelector 
          categories={BARBER_CATEGORIES}
          selectedCategory={selectedCategory} 
          onSelectCategory={setSelectedCategory} 
        />
        <div className="relative z-10">
            <ServiceList services={filteredServices} onBook={handleBook} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BarberPage;
