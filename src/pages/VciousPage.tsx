import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SERVICES } from '@/constants';
import { ExternalLink, ShoppingBag } from 'lucide-react';

const VciousPage: React.FC = () => {
  // Filtramos solo los productos de V-cious usando su ID (vc1, vc2...)
  const vciousProducts = SERVICES.filter(s => s.id.startsWith('vc'));

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white">
      <Header />
      
      {/* Margen para el Sidebar Header */}
      <main className="flex-1 w-full md:ml-64 relative overflow-hidden">
        
        {/* Fondo con Textura de Fibra de Carbono (CSS simple) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
        </div>

        {/* Hero Section V-cious */}
        <section className="relative py-20 px-6 border-b border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-4 animate-pulse">
              V-CIOUS
            </h1>
            <p className="text-[#A855F7] font-bold tracking-[0.5em] uppercase text-xs md:text-sm">
              Urban Racing & Psych Style
            </p>
          </div>
        </section>

        {/* Galería de Productos */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {vciousProducts.map((product) => (
              <div key={product.id} className="group relative bg-[#111] border border-white/10 rounded-sm overflow-hidden hover:border-[#A855F7] transition-all duration-500">
                {/* Imagen del Producto */}
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                {/* Info y Botón de Pago */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold uppercase italic">{product.name}</h3>
                      <p className="text-gray-500 text-xs mt-1">{product.duration}</p>
                    </div>
                    <span className="text-2xl font-black text-[#A855F7]">${product.price}</span>
                  </div>

                  {/* BOTÓN MERCADO PAGO: Aquí pondrás tus links de MP en el futuro */}
                  <button 
                    onClick={() => window.open('https://www.mercadopago.com.mx/', '_blank')}
                    className="w-full flex items-center justify-center gap-2 bg-white text-black py-4 font-black uppercase tracking-widest text-xs hover:bg-[#A855F7] hover:text-white transition-all shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                  >
                    Pagar Ahora <ShoppingBag size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Banner de Ubicación rápida */}
        <div className="max-w-4xl mx-auto px-6 mb-20">
            <div className="p-8 bg-gradient-to-r from-[#A855F7]/20 to-transparent border border-[#A855F7]/30 rounded-sm text-center">
                <p className="text-sm font-bold uppercase tracking-widest mb-4">Disponible para entrega inmediata en el Spot</p>
                <a href="https://maps.app.goo.gl/mntKjS53uPkjZZQZ9" target="_blank" className="inline-flex items-center gap-2 text-xs underline font-bold">
                    Ver Mapa de la Barbería <ExternalLink size={12} />
                </a>
            </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VciousPage; // ESTO ES LO QUE ARREGLA EL ERROR DEL LOG
