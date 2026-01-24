import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
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

  useEffect(() => {
    if (isOpen) {
      if (service.category === 'Productos') {
        setStep(service.sizes ? 'SELECT_SIZE' : 'ENTER_DETAILS');
      } else {
        setStep('SELECT_PROFESSIONAL');
      }
      setName('');
      setPhone('');
      setSelectedSize(null);
    }
  }, [isOpen, service]);

  const handleBook = async () => {
    setIsSubmitting(true);
    const payload: BookingPayload = {
      nombre_cliente: name,
      telefono_cliente: phone,
      servicio_id: service.id,
      servicio_nombre: service.name,
      precio: service.price,
      talla: selectedSize || 'N/A',
      fecha_hora: service.category === 'Productos' ? 'VENTA-INMEDIATA' : `${selectedDate} ${selectedTime}`,
      barbero_id: service.category === 'Productos' ? 'V-CIOUS-SPOT' : (selectedPro?.id || 'P1'),
      source: 'web',
    };

    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (service.category === 'Productos' && service.mpLink) {
        window.location.href = service.mpLink;
        return;
      }
      
      setStep('CONFIRMATION');
    } catch (error) {
      setStep('CONFIRMATION');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // VARIABLE DE ESTILO CONDICIONAL
  const isVcious = service.category === 'Productos';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* 1. CAMBIO: Fondo dinámico (Negro para V-cious, Blanco para Barbería) */}
      <div className={`relative w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] z-[110] rounded-sm transition-colors duration-500 ${
        isVcious ? 'bg-[#111] text-white' : 'bg-white text-black'
      }`}>
        
        <div className={`flex justify-between items-center p-6 border-b ${isVcious ? 'border-white/10' : 'border-gray-100'}`}>
          <h2 className="text-xl font-bold tracking-tight uppercase italic">
            {isVcious ? 'Checkout V-cious' : 'Agendar Cita'}
          </h2>
          <button onClick={onClose} className={`p-1 rounded-full ${isVcious ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step !== 'CONFIRMATION' && (
            <div className={`mb-6 p-4 border-l-2 border-[#A855F7] flex gap-4 items-center ${isVcious ? 'bg-white/5' : 'bg-gray-50'}`}>
              <img src={service.image} className="w-16 h-16 object-cover rounded-sm" alt="Preview" />
              <div>
                <p className="font-black text-sm uppercase italic">{service.name}</p>
                <p className="text-xl font-black text-[#A855F7]">${service.price}</p>
              </div>
            </div>
          )}

          {/* PASO: SELECCIÓN DE TALLA (Oscuro Neón) */}
          {step === 'SELECT_SIZE' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-[#A855F7] mb-2">
                  Buena elección, te verás cool 🔥
                </h3>
                <p className="text-xs text-gray-400 uppercase font-bold italic">Selecciona tu talla racing:</p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {service.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setStep('ENTER_DETAILS'); }}
                    className="relative group py-5 bg-black border-2 border-[#A855F7]/30 hover:border-[#A855F7] rounded-sm transition-all duration-300 shadow-[0_0_10px_rgba(168,85,247,0.1)] hover:shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                  >
                    <span className="text-white font-black text-lg">{size}</span>
                    <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#A855F7] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ... Pasos intermedios se mantienen con isVcious ? ... */}

          {/* PASO FINAL: DATOS (REPARACIÓN DE VISIBILIDAD) */}
          {step === 'ENTER_DETAILS' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                {!isVcious && (
                    <button onClick={() => setStep('SELECT_TIME')} className="text-gray-400 hover:text-black"><ChevronLeft size={20}/></button>
                )}
                <h3 className={`text-lg font-medium italic ${isVcious ? 'text-[#A855F7]' : 'text-black'}`}>
                    Datos para tu comprobante
                </h3>
              </div>
              
              <div className="space-y-4">
                {/* 2. CAMBIO: Color de texto forzado según el fondo para que siempre sea visible */}
                <input 
                    type="text" 
                    placeholder="Tu Nombre" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className={`w-full py-3 border-b outline-none focus:border-[#A855F7] font-medium bg-transparent transition-colors ${
                        isVcious ? 'text-white placeholder:text-gray-600' : 'text-black placeholder:text-gray-400'
                    }`} 
                />
                <input 
                    type="tel" 
                    placeholder="WhatsApp (10 dígitos)" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    className={`w-full py-3 border-b outline-none focus:border-[#A855F7] font-medium bg-transparent transition-colors ${
                        isVcious ? 'text-white placeholder:text-gray-600' : 'text-black placeholder:text-gray-400'
                    }`} 
                />
              </div>

              <button 
                onClick={handleBook}
                disabled={!name || !phone || isSubmitting}
                className={`w-full py-4 font-black uppercase transition-all tracking-widest flex items-center justify-center gap-2 ${
                    isVcious ? 'bg-[#A855F7] text-white hover:bg-white hover:text-black' : 'bg-black text-white hover:bg-[#A855F7]'
                } disabled:bg-gray-800 disabled:text-gray-500`}
              >
                {isSubmitting ? 'Procesando...' : (isVcious ? 'Pagar en Mercado Pago' : 'Confirmar Cita')}
                {isVcious && <ShoppingBag size={18} />}
              </button>
            </div>
          )}

          {/* ÉXITO */}
          {step === 'CONFIRMATION' && (
            <div className="text-center py-10">
              <CheckCircle className="mx-auto text-[#A855F7] mb-4" size={60} />
              <h2 className={`text-2xl font-bold ${isVcious ? 'text-white' : 'text-black'}`}>¡Solicitud Enviada!</h2>
              <p className="text-gray-500 mt-2">El Fachebot te contactará por WhatsApp.</p>
              <button onClick={onClose} className="mt-8 font-bold underline">Cerrar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
