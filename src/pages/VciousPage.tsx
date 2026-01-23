import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { SERVICES } from '@/constants';
import { ExternalLink, ShoppingBag, Zap, Trophy } from 'lucide-react';

const VciousPage: React.FC = () => {
  // Filtramos productos V-cious (IDs vc1, vc2...) y ceras/pomadas
  const vciousProducts = SERVICES.filter(s => s.id.startsWith('vc') || s.id.startsWith('prod'));

  const spotImageUrl = "https://res.cloudinary.com/dqwslpah7/image/upload/v1769099173/spot_real_shxxxz.jpg";

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-[#A855F7]">
      <Header />
      
      {/* Contenedor Principal con el Spot de fondo */}
      <main className="flex-1 w-full md:ml-64 relative">
        
        {/* BACKGROUND EXÓTICO: Spot Real + Overlay Psicodélico */}
        <div className="fixed inset-0 z-0">
          <img 
            src={spotImageUrl} 
            alt="V-cious Underground Spot" 
            className="w-full h-full object-cover opacity-30 grayscale-[0.5] contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/80 to-[#A855F7]/10" />
          
          {/* Textura de Fibra de Carbono animada */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none animate-pulse" 
               style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
          </div>
        </div>

        <div className="relative z-10">
          {/* HERO SECTION: Agresivo & Racing */}
          <section className="relative pt-32 pb-20 px-6 text-center overflow-hidden">
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full opacity-10 flex justify-center gap-10 whitespace-nowrap font-black italic text-9xl pointer-events-none">
              <span>RACING</span><span>PSYCH</span><span>URBAN</span>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter mb-4 drop-shadow-[0_0_30px_rgba(168,85,247,0.8)] animate-in fade-in slide-in-from-bottom-10 duration-1000">
              V-CIOUS
            </h1>
            <div className="flex items-center justify-center gap-4 text-[#A855F7] font-black tracking-[0.6em] uppercase text-[10px] md:text-sm">
              <Zap size={16} /> 
              <span>Estilo de alta gama para la calle</span>
              <Zap size={16} />
            </div>
          </section>

          {/* GALERÍA: Cartas tipo "Glassmorphism" */}
          <section className="max-w-6xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {vciousProducts.map((product) => (
                <div key={product.id} className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-sm overflow-hidden hover:border-[#A855F7]/50 transition-all duration-700 shadow-2xl">
                  
                  {/* Badge de Categoría */}
                  <div className="absolute top-4 left-4 z-20 bg-black/80 text-[8px] font-black px-3 py-1 rounded-full border border-[#A855F7] tracking-widest uppercase">
                    {product.id.startsWith('vc') ? 'Limited Merch' : 'Elite Care'}
                  </div>

                  {/* Imagen del Producto */}
                  <div className="aspect-square overflow-hidden bg-black">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                    />
                  </div>

                  {/* Detalle Técnico */}
                  <div className="p-8 border-t border-white/5">
                    <div className="flex justify-between items-start mb-6">
                      <div className="max-w-[70%]">
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none mb-2">
                          {product.name}
                        </h3>
                        <p className="text-gray-400 text-[10px] leading-relaxed uppercase tracking-widest line-clamp-2">
                          {product.duration}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-3xl font-black text-[#A855F7] italic">${product.price}</span>
                      </div>
                    </div>

                    {/* Botón de Compra Directa */}
                    <button 
                      onClick={() => window.open('https://www.mercadopago.com.mx/', '_blank')}
                      className="w-full flex items-center justify-center gap-3 bg-white text-black py-5 font-black uppercase tracking-[0.3em] text-[10px] hover:bg-[#A855F7] hover:text-white transition-all duration-500 transform group-hover:translate-y-[-4px]"
                    >
                      Asegurar Stock <ShoppingBag size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* BANNER DE ENTREGA: Trust Signal */}
          <div className="max-w-4xl mx-auto px-6 mb-32">
              <div className="relative p-10 bg-black border border-[#A855F7]/40 rounded-sm overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                      <Trophy size={80} />
                  </div>
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <h4 className="text-xl font-black italic mb-2 tracking-tighter">ENTREGA INMEDIATA EN TAMPICO CAÑADA</h4>
                    <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-6">Paga en línea y recoge tu merch hoy mismo en el spot oficial.</p>
                    <a href="https://maps.app.goo.gl/mntKjS53uPkjZZQZ9" target="_blank" className="flex items-center gap-2 text-[10px] font-black bg-[#A855F7] px-6 py-2 rounded-full hover:scale-110 transition-transform">
                      CÓMO LLEGAR AL SPOT <ExternalLink size={12} />
                    </a>
                  </div>
              </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VciousPage;
