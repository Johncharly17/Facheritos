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

// 1. Definimos las categorías que SÓLO pertenecen a la barbería
const BARBER_CATEGORIES = ['Cortes', 'Combos', 'Barba', 'Faciales'];

const BarberPage: React.FC = () => {
  // CORRECCIÓN: useState solo recibe el valor inicial (ej. 'Cortes')
  const [selectedCategory, setSelectedCategory] = useState('Cortes');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  // 2. Filtramos para que NUNCA se mezclen las playeras aquí
  const filteredServices = useMemo(() => {
    const onlyBarberServices = SERVICES.filter(s => s.category !== 'Productos');
    return onlyBarberServices.filter((s) => s.category === selectedCategory);
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
      
      {/* Margen md:ml-64 para el Sidebar que creamos */}
      <main className="flex-1 w-full pt-[60px] md:pt-0 md:ml-64 relative z-0">
        <ShopProfile />

        {/* --- BANNER MINIMALISTA V-CIOUS --- */}
        <section className="max-w-4xl mx-auto px-4 py-12">
           {/* ... (Tu código del banner neón se mantiene igual) ... */}
        </section>

        {/* 3. VITAL: Pasamos la prop 'categories' que creamos en el paso anterior */}
        <CategorySelector 
          categories={BARBER_CATEGORIES}
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
