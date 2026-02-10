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

  // 1. Generador de fechas (Asegura que siempre haya 7 días disponibles)
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
        setStep(service.sizes ? 'SELECT_SIZE' : 'ENTER_DETAILS');
      } else {
        setStep('SELECT_PROFESSIONAL');
      }
      setName('');
      setPhone('');
      setSelectedSize(null);
      setSelectedDate(null);
      setSelectedTime(null);
    }
  }, [isOpen, service]);

  const handlePayloadSend = async (method?: string, price?: number) => {
    const payload: BookingPayload = {
      nombre_cliente: name,
      telefono_cliente: phone,
      servicio_id: service.id,
      servicio_nombre: service.name,
      precio: price || service.price,
      talla: selectedSize || 'N/A',
      fecha_hora: service.category === 'Productos' ? 'VENTA-INMEDIATA' : `${selectedDate} ${selectedTime}`,
      barbero_id: service.category === 'Productos' ? 'V-CIOUS-SPOT' : (selectedPro?.id || 'P1'),
      metodo_pago: method || 'Pendiente',
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

  const handleBook = async () => {
    setIsSubmitting(true);
    await handlePayloadSend('Cita Agendada', service.price);
    setStep('CONFIRMATION');
    setIsSubmitting(false);
  };

  const processPayment = async (method: 'MercadoPago' | 'Transferencia') => {
    setIsSubmitting(true);
    const finalPrice = method === 'MercadoPago' ? finalPriceMP : service.price;
    await handlePayloadSend(method, finalPrice);

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
      
      <div className={`relative w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] z-[110] rounded-sm transition-colors duration-500 ${
        isVcious ? 'bg-[#0a0a0a] text-white border border-[#A855F7]/30' : 'bg-white text-black'
      }`}>
        
        <div className={`flex justify-between items-center p-6 border-b ${isVcious ? 'border-white/10' : 'border-gray-100'}`}>
          <h2 className="text-xl font-bold tracking-tight uppercase italic">{isVcious ? 'V-cious Store' : 'Agendar Cita'}</h2>
          <button onClick={onClose} className="p-1 hover:opacity-50 transition-opacity"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Resumen del Servicio */}
          {step !== 'CONFIRMATION' && step !== 'SHOW_BBVA_DATA' && (
            <div className={`mb-6 p-4 border-l-2 border-[#A855F7] flex gap-4 items-center ${isVcious ? 'bg-white/5' : 'bg-gray-50'}`}>
              <img src={service.image} className="w-14 h-14 object-cover rounded-sm" alt="Thumbnail" />
              <div>
                <p className="font-black text-sm uppercase italic leading-none">{service.name}</p>
                <p className="text-lg font-black text-[#A855F7]">${service.price}</p>
              </div>
            </div>
          )}

          {/* PASO 1: BARBERO */}
          {step === 'SELECT_PROFESSIONAL' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">¿Quién te pondrá facherito?</h3>
              {PROFESSIONALS.map((pro) => (
                <button
                  key={pro.id}
                  onClick={() => { setSelectedPro(pro); setStep('SELECT_DATE'); }}
                  className="w-full flex items-center gap-4 p-4 border border-gray-100 rounded-sm hover:border-black transition-all group"
                >
                  <img src={pro.avatar} alt={pro.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="text-left">
                    <p className="font-bold">{pro.name}</p>
                    <p className="text-xs text-gray-400">Barbero Profesional</p>
                  </div>
                  <ChevronRight className="ml-auto text-gray-300 group-hover:text-black transition-colors" size={20} />
                </button>
              ))}
            </div>
          )}

          {/* PASO 2: SELECCIONAR DÍA (Corregido) */}
          {step === 'SELECT_DATE' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setStep('SELECT_PROFESSIONAL')} className="text-gray-400 hover:text-black transition-colors"><ChevronLeft size={20}/></button>
                <h3 className="font-bold italic">Selecciona el día</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {nextDays.map((date) => {
                  const isoDate = date.toISOString().split('T')[0];
                  return (
                    <button
                      key={isoDate}
                      onClick={() => { setSelectedDate(isoDate); setStep('SELECT_TIME'); }}
                      className="p-3 border rounded-sm text-center hover:border-[#A855F7] transition-colors"
                    >
                      <span className="block capitalize font-bold text-xs">{date.toLocaleDateString('es-MX', { weekday: 'short' })}</span>
                      <span className="block text-xs font-black">{date.getDate()} {date.toLocaleDateString('es-MX', { month: 'short' })}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* PASO 3: SELECCIONAR HORA (Corregido) */}
          {step === 'SELECT_TIME' && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setStep('SELECT_DATE')} className="text-gray-400 hover:text-black transition-colors"><ChevronLeft size={20}/></button>
                <h3 className="font-bold italic">¿A qué hora vienes?</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {TIME_SLOTS.map((time) => (
                  <button
                    key={time}
                    onClick={() => { setSelectedTime(time); setStep('ENTER_DETAILS'); }}
                    className="py-3 border rounded-sm text-sm font-bold hover:bg-black hover:text-white transition-all"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PASO FINAL: DATOS */}
          {step === 'ENTER_DETAILS' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                {!isVcious && (
                    <button onClick={() => setStep('SELECT_TIME')} className="text-gray-400 hover:text-black transition-colors"><ChevronLeft size={20}/></button>
                )}
                <h3 className={`font-black italic ${isVcious ? 'text-[#A855F7]' : 'text-black'}`}>Tus datos de contacto</h3>
              </div>
              <div className="space-y-4">
                <input type="text" placeholder="Tu Nombre Completo" value={name} onChange={e => setName(e.target.value)} className={`w-full py-3 border-b outline-none focus:border-[#A855F7] font-medium bg-transparent ${isVcious ? 'text-white placeholder:text-gray-600' : 'text-black'}`} />
                <input type="tel" placeholder="WhatsApp (10 dígitos)" value={phone} onChange={e => setPhone(e.target.value)} className={`w-full py-3 border-b outline-none focus:border-[#A855F7] font-medium bg-transparent ${isVcious ? 'text-white placeholder:text-gray-600' : 'text-black'}`} />
              </div>
              <button 
                onClick={() => isVcious ? setStep('SELECT_PAYMENT_METHOD') : handleBook()}
                disabled={!name || !phone || isSubmitting}
                className={`w-full py-4 font-black uppercase tracking-widest transition-all ${
                  isVcious ? 'bg-[#A855F7] text-white hover:bg-white hover:text-black' : 'bg-black text-white hover:bg-[#A855F7]'
                } disabled:opacity-50`}
              >
                {isSubmitting ? 'Procesando...' : (isVcious ? 'Siguiente' : 'Confirmar Cita')}
              </button>
            </div>
          )}

          {/* Pasos de Pago y Confirmación (se mantienen igual)... */}
          {/* ÉXITO */}
          {step === 'CONFIRMATION' && (
            <div className="text-center py-10 animate-in fade-in zoom-in">
              <CheckCircle className="mx-auto text-[#A855F7] mb-4" size={60} />
              <h2 className={`text-2xl font-bold italic ${isVcious ? 'text-white' : 'text-black'}`}>¡Todo listo!</h2>
              <p className="text-gray-500 text-sm mt-2">El Fachebot registró tu solicitud.</p>
              <button onClick={onClose} className="mt-8 font-bold underline decoration-[#A855F7] underline-offset-4">Cerrar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
