import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generador de los próximos 7 días
  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push(d);
    }
    return days;
  };
  const nextDays = getNextDays();

  // Reiniciar estado según el tipo de servicio al abrir
  useEffect(() => {
    if (isOpen) {
      if (service.category === 'Productos') {
        setStep('ENTER_DETAILS'); // Salto directo para productos
      } else {
        setStep('SELECT_PROFESSIONAL'); // Flujo completo para cortes
      }
      setName('');
      setPhone('');
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
      fecha_hora: service.category === 'Productos' ? 'PRODUCTO-VENTA' : `${selectedDate} ${selectedTime}`,
      barbero_id: service.category === 'Productos' ? 'V-CIOUS' : (selectedPro?.id || 'P1'),
      source: 'web',
    };

    try {
      await fetch(N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setStep('CONFIRMATION');
    } catch (error) {
      setStep('CONFIRMATION');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col max-h-[90vh] z-[110] rounded-sm">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold tracking-tight">
            {service.category === 'Productos' ? 'Comprar Producto' : 'Agendar Cita'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {step !== 'CONFIRMATION' && (
            <div className="mb-6 p-4 bg-gray-50 border-l-2 border-[#A855F7]">
              <p className="text-xs text-gray-500 uppercase mb-1">Seleccionado</p>
              <p className="font-bold text-lg">{service.name}</p>
              <p className="text-sm text-gray-600">${service.price}</p>
            </div>
          )}

          {/* PASO 1: BARBERO */}
          {step === 'SELECT_PROFESSIONAL' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-4 italic">¿Quién te va a poner facherito?</h3>
              {PROFESSIONALS.map((pro) => (
                <button
                  key={pro.id}
                  onClick={() => { setSelectedPro(pro); setStep('SELECT_DATE'); }}
                  className="w-full flex items-center gap-4 p-4 border rounded-sm hover:border-black transition-all group"
                >
                  <img src={pro.avatar} alt={pro.name} className="w-12 h-12 rounded-full object-cover" />
                  <div className="text-left">
                    <p className="font-bold">{pro.name}</p>
                    <p className="text-sm text-gray-500 italic font-medium">Barbero Profesional</p>
                  </div>
                  <ChevronRight className="ml-auto text-gray-300 group-hover:text-black" size={20} />
                </button>
              ))}
            </div>
          )}

          {/* PASO 2: FECHA */}
          {step === 'SELECT_DATE' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setStep('SELECT_PROFESSIONAL')} className="text-gray-400 hover:text-black"><ChevronLeft size={20}/></button>
                <h3 className="text-lg font-medium italic">¿Qué día vienes?</h3>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {nextDays.map((date) => {
                  const isoDate = date.toISOString().split('T')[0];
                  return (
                    <button
                      key={isoDate}
                      onClick={() => { setSelectedDate(isoDate); setStep('SELECT_TIME'); }}
                      className="p-3 border rounded-sm text-center hover:border-[#A855F7]"
                    >
                      <span className="block capitalize font-bold">{date.toLocaleDateString('es-MX', { weekday: 'short' })}</span>
                      <span className="block text-xs">{date.getDate()} {date.toLocaleDateString('es-MX', { month: 'short' })}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* PASO 3: HORA */}
          {step === 'SELECT_TIME' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setStep('SELECT_DATE')} className="text-gray-400 hover:text-black"><ChevronLeft size={20}/></button>
                <h3 className="text-lg font-medium italic">¿A qué hora?</h3>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {TIME_SLOTS.map((time) => (
                  <button
                    key={time}
                    onClick={() => { setSelectedTime(time); setStep('ENTER_DETAILS'); }}
                    className="py-3 border rounded-sm text-sm font-medium hover:bg-black hover:text-white transition-all"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* PASO 4: DATOS FINAL */}
          {step === 'ENTER_DETAILS' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                {service.category !== 'Productos' && (
                    <button onClick={() => setStep('SELECT_TIME')} className="text-gray-400 hover:text-black"><ChevronLeft size={20}/></button>
                )}
                <h3 className="text-lg font-medium italic">Tus Datos para el Fachebot</h3>
              </div>
              <div className="space-y-4">
                <input type="text" placeholder="Tu Nombre Completo" value={name} onChange={e => setName(e.target.value)} className="w-full py-3 border-b outline-none focus:border-[#A855F7] font-medium" />
                <input type="tel" placeholder="WhatsApp (10 dígitos)" value={phone} onChange={e => setPhone(e.target.value)} className="w-full py-3 border-b outline-none focus:border-[#A855F7] font-medium" />
              </div>
              <button 
                onClick={handleBook}
                disabled={!name || !phone || isSubmitting}
                className="w-full py-4 bg-black text-white font-bold uppercase hover:bg-[#A855F7] disabled:bg-gray-300 transition-all tracking-widest"
              >
                {isSubmitting ? 'Procesando...' : (service.category === 'Productos' ? 'Confirmar Compra' : 'Confirmar Cita')}
              </button>
            </div>
          )}

          {/* ÉXITO */}
          {step === 'CONFIRMATION' && (
            <div className="text-center py-10 animate-in fade-in zoom-in duration-300">
              <CheckCircle className="mx-auto text-[#A855F7] mb-4" size={60} />
              <h2 className="text-2xl font-bold">¡Solicitud Enviada!</h2>
              <p className="text-gray-600 mt-2">El Fachebot te contactará por WhatsApp para confirmar.</p>
              <button onClick={onClose} className="mt-8 font-bold underline hover:text-[#A855F7]">Volver a la Barber</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
