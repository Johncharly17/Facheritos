import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ChevronLeft, ChevronRight, ShoppingBag, CreditCard, Landmark } from 'lucide-react';
import { Service, Professional, BookingStep, BookingPayload } from '../types';
import { PROFESSIONALS, TIME_SLOTS, N8N_WEBHOOK_URL } from '../constants';

interface BookingModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ service, isOpen, onClose }) => {
  const [step, setStep] = useState<BookingStep>('SELECT_PROFESSIONAL');
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nextDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const mpFee = 1.035;
  const finalPriceMP = Math.round(service.price * mpFee);

  useEffect(() => {
    if (isOpen) {
      if (service.category === 'Productos') {
        // Inicia en Talla si es ropa, si no va directo a Datos
        setStep(service.sizes ? 'SELECT_SIZE' : 'ENTER_DETAILS');
      } else {
        setStep('SELECT_PROFESSIONAL');
      }
      setName('');
      setPhone('');
      setSelectedSize(null);
    }
  }, [isOpen, service]);

  // FUNCIÓN CENTRAL DEL WEBHOOK (n8n)
  const handlePayloadSend = async (method?: string, price?: number) => {
    const payload: BookingPayload = {
      nombre_cliente: name,
      telefono_cliente: phone,
      servicio_id: service.id,
      servicio_nombre: service.name,
      precio: price || service.price,
      talla: selectedSize || 'N/A',
      fecha_hora: service.category === 'Productos' ? 'VENTA-WEB-PRODUCTO' : `${selectedDate} ${selectedTime}`,
      barbero_id: service.category === 'Productos' ? 'V-CIOUS-SPOT' : (selectedPro?.id || 'P1'),
      source: 'web',
    };

    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Error enviando a n8n:", error);
    }
  };

  // Acción para Citas de Barbería
  const handleBarberBooking = async () => {
    setIsSubmitting(true);
    await handlePayloadSend('Cita Pendiente');
    setStep('CONFIRMATION');
    setIsSubmitting(false);
  };

  // Acción para Ventas V-cious (Híbrido MP/BBVA)
  const handleProductPurchase = async (method: 'MercadoPago' | 'Transferencia') => {
    setIsSubmitting(true);
    const finalPrice = method === 'MercadoPago' ? finalPriceMP : service.price;
    
    // 1. Mandamos el webhook a n8n con el método elegido
    await handlePayloadSend(method, finalPrice);

    // 2. Ejecutamos la acción de pago
    if (method === 'MercadoPago' && service.mpLink) {
      window.location.href = service.mpLink;
    } else {
      setStep('SHOW_BBVA_DATA');
    }
    setIsSubmitting(false);
  };

  if (!isOpen) return null;
  const isVcious = service.category === 'Productos';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className={`relative w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] z-[110] rounded-sm ${
        isVcious ? 'bg-[#0a0a0a] text-white border border-[#A855F7]/30' : 'bg-white text-black'
      }`}>
        
        <div className={`flex justify-between items-center p-6 border-b ${isVcious ? 'border-white/10' : 'border-gray-100'}`}>
          <h2 className="text-xl font-bold tracking-tight uppercase italic">
            {isVcious ? 'V-cious Store' : 'Agendar Cita'}
          </h2>
          <button onClick={onClose} className="p-1 hover:opacity-50"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* PASO: SELECCIONAR TALLA */}
          {step === 'SELECT_SIZE' && (
            <div className="space-y-6 text-center">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#A855F7]">Buena elección, te verás cool 🔥</h3>
              <div className="grid grid-cols-3 gap-4">
                {service.sizes?.map((size) => (
                  <button key={size} onClick={() => { setSelectedSize(size); setStep('ENTER_DETAILS'); }} className="py-5 bg-black border-2 border-[#A855F7]/30 hover:border-[#A855F7] rounded-sm font-black text-white">
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PASO: DATOS (Nombre y Teléfono) */}
          {step === 'ENTER_DETAILS' && (
            <div className="space-y-6">
              <h3 className={`font-black italic ${isVcious ? 'text-[#A855F7]' : 'text-black'}`}>Completa tus datos para el envío</h3>
              <div className="space-y-4">
                <input type="text" placeholder="Tu Nombre" value={name} onChange={e => setName(e.target.value)} className={`w-full py-3 border-b outline-none focus:border-[#A855F7] font-medium bg-transparent ${isVcious ? 'text-white' : 'text-black'}`} />
                <input type="tel" placeholder="WhatsApp (10 dígitos)" value={phone} onChange={e => setPhone(e.target.value)} className={`w-full py-3 border-b outline-none focus:border-[#A855F7] font-medium bg-transparent ${isVcious ? 'text-white' : 'text-black'}`} />
              </div>
              <button 
                onClick={() => isVcious ? setStep('SELECT_PAYMENT_METHOD') : handleBarberBooking()}
                disabled={!name || !phone || isSubmitting}
                className={`w-full py-4 font-black uppercase tracking-widest ${isVcious ? 'bg-[#A855F7] text-white' : 'bg-black text-white'} disabled:opacity-50`}
              >
                {isSubmitting ? 'Procesando...' : (isVcious ? 'Siguiente' : 'Confirmar Cita')}
              </button>
            </div>
          )}

          {/* PASO: MÉTODO DE PAGO */}
          {step === 'SELECT_PAYMENT_METHOD' && (
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase text-[#A855F7] text-center mb-6 tracking-widest">¿Cómo prefieres pagar?</h3>
              <button onClick={() => handleProductPurchase('MercadoPago')} className="w-full flex items-center justify-between p-5 border border-white/10 bg-white/5 hover:bg-[#A855F7] transition-all">
                <div className="text-left"><p className="font-black text-[10px] uppercase">Tarjeta / Mercado Pago</p><p className="text-[9px] opacity-60">Total: ${finalPriceMP}</p></div>
                <ChevronRight size={18} />
              </button>
              <button onClick={() => handleProductPurchase('Transferencia')} className="w-full flex items-center justify-between p-5 border-2 border-white hover:bg-white hover:text-black transition-all">
                <div className="text-left"><p className="font-black text-[10px] uppercase">Transferencia BBVA</p><p className="text-[9px] opacity-60">Total: ${service.price}</p></div>
                <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* ... resto de pasos (BBVA y Confirmación) se mantienen igual ... */}
          {step === 'SHOW_BBVA_DATA' && (
            <div className="space-y-6 text-center animate-in zoom-in">
              <div className="p-6 bg-white/5 border border-[#A855F7]/30 rounded-sm">
                <p className="text-[10px] font-black uppercase text-[#A855F7] mb-4 tracking-widest flex items-center justify-center gap-2">
                   <Landmark size={14} /> Cuenta BBVA México
                </p>
                <div className="space-y-2 text-sm font-mono">
                  <p className="flex justify-between border-b border-white/5 pb-1"><span className="opacity-40 uppercase text-[10px]">Tarjeta:</span> 4152 3144 3526 8290</p>
                  <p className="flex justify-between border-b border-white/5 pb-1"><span className="opacity-40 uppercase text-[10px]">Nombre:</span> Juan Carlos D</p>
                  <p className="flex justify-between"><span className="opacity-40 uppercase text-[10px]">Monto:</span> ${service.price}</p>
                </div>
              </div>
              <p className="text-[10px] italic text-gray-400">Muestra captura a Manuel Soprano.</p>
              <button onClick={() => setStep('CONFIRMATION')} className="w-full py-4 bg-white text-black font-black uppercase text-xs">Ya transferí</button>
            </div>
          )}

          {step === 'CONFIRMATION' && (
            <div className="text-center py-10 animate-in fade-in zoom-in">
              <CheckCircle className="mx-auto text-[#A855F7] mb-4" size={60} />
              <h2 className={`text-2xl font-bold italic ${isVcious ? 'text-white' : 'text-black'}`}>¡Todo listo!</h2>
              <button onClick={onClose} className="mt-8 font-bold underline">Cerrar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
