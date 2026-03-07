import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom'; // Para el botón de retorno
import Header from '../components/Header';
import Footer from '../components/Footer';
import BookingModal from '../components/BookingModal'; // VITAL: Para el flujo de compra
import { SERVICES } from '@/constants';
import { Service } from '../types';
import { ShoppingBag, Zap, Sparkles, Shirt, ChevronLeft } from 'lucide-react';

const VciousPage: React.FC = () => {
  const VCIOUS_CATEGORIES = ['Ropa con Estilo', 'Productos de Belleza'];
  const [selectedCategory, setSelectedCategory] = useState('Ropa con Estilo');
  
  // ESTADOS PARA EL MODAL DE COMPRA
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Service | null>(null);

  const spotImageUrl = "https://res.cloudinary.com/dqwslpah7/image/upload/v1769099173/spot_real_shxxxz.jpg";

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Ropa con Estilo') {
      return SERVICES.filter(s => s.id.startsWith('vc'));
    }
    return SERVICES.filter(s => s.id.startsWith('prod'));
  }, [selectedCategory]);

  // FUNCIONES DE CONTROL
  const handleOpenModal = (product: Service) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-[#A855F7]">
      <Header />
      
      <main className="flex-1 w-full md:ml-64 relative overflow-hidden">
        
        {/* --- BOTÓN VOLVER A FACHERITOS (Minimalista y elegante) --- */}
        <div className="fixed top-[75px] left-4 md:top-8 md:left-8 z-[60]">
          <Link 
            to="/" 
            className="flex items-center gap-2 text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] bg-[#A855F7] text-white px-5 py-3 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:scale-105 active:scale-95 transition-all"
          >
            <ChevronLeft size={16} strokeWidth={3} /> Volver a Barbería
          </Link>
        </div>

        {/* --- HERO SECTION --- */}
        <section className="relative h-[40vh] md:h-[50vh] overflow-hidden border-b border-[#A855F7]/30">
          <img 
            src={spotImageUrl} 
            alt="V-cious Underground Spot" 
            className="w-full h-full object-cover grayscale-[0.3] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <h1 className="text-6xl md:text-9xl font-black italic tracking-tighter drop-shadow-[0_0_20px_rgba(168,85,247,0.8)] animate-pulse uppercase">
              V-CIOUS
            </h1>
            <div className="bg-black/60 backdrop-blur-md px-4 py-1 border border-[#A855F7]/50 mt-4">
               <p className="text-[#A855F7] text-[10px] md:text-xs font-black tracking-[0.5em] uppercase">
                Urban Racing & Abstract Style 
               </p>
            </div>
          </div>
        </section>

        {/* --- SELECTOR DE CATEGORÍA --- */}
        <div className="sticky top-[60px] md:top-0 z-30 bg-black/80 backdrop-blur-lg border-b border-white/5 py-4">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex justify-center gap-8">
              {VCIOUS_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    selectedCategory === cat 
                    ? 'text-[#A855F7] border-b-2 border-[#A855F7] pb-1' 
                    : 'text-gray-500 hover:text-white'
                  }`}
                >
                  {cat === 'Ropa con Estilo' ? <Shirt size={14} /> : <Sparkles size={14} />}
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* --- GALERÍA DE PRODUCTOS --- */}
        <section className="max-w-6xl mx-auto px-6 py-16 relative">
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
               style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
            {filteredProducts.map((product) => (
              <div 
                key={product.id} 
                className="group relative bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden hover:border-[#A855F7] transition-all duration-500 shadow-2xl"
              >
                <div className="aspect-square overflow-hidden relative">
                  <div className="absolute inset-0 bg-[#A855F7]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none mb-2">
                        {product.name}
                      </h3>
                      <p className="text-gray-500 text-[10px] uppercase tracking-widest leading-relaxed">
                        {product.duration}
                      </p>
                    </div>
                    <span className="text-3xl font-black text-[#A855F7] italic">${product.price}</span>
                  </div>

                  {/* CORRECCIÓN: Ahora llama a la función handleOpenModal */}
                  <button 
                    onClick={() => handleOpenModal(product)}
                    className="w-full flex items-center justify-center gap-3 bg-white text-black py-4 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-[#A855F7] hover:text-white transition-all duration-500 shadow-[0_10px_30px_rgba(168,85,247,0.2)]"
                  >
                    Asegurar Stock <ShoppingBag size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />

      {/* RENDERIZADO DEL MODAL */}
      {selectedProduct && (
        <BookingModal 
          service={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default VciousPage;
