import React, { useState, useEffect } from 'react';
import { X, CheckCircle, ChevronLeft } from 'lucide-react';
import { Service, Professional, BookingStep, BookingPayload } from '../types';
import { PROFESSIONALS, TIME_SLOTS, N8N_WEBHOOK_URL } from '../constants';

interface BookingModalProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ service, isOpen, onClose }) => {
  // Lógica: Si es producto, empezamos en el paso de DATOS directamente
  const initialStep = service.category === 'Productos' ? 'ENTER_DETAILS' : 'SELECT_PROFESSIONAL';
  const [step, setStep] = useState<BookingStep>(initialStep);
  
  const [selectedPro, setSelectedPro] = useState<Professional | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reiniciar el paso cuando se abre con un servicio nuevo
  useEffect(() => {
    if (isOpen) {
      setStep(service.category === 'Productos' ? 'ENTER_DETAILS' : 'SELECT_PROFESSIONAL');
    }
  }, [isOpen, service]);

  const handleBook = async () => {
    setIsSubmitting(true);

    // Payload para n8n: Si es producto, mandamos valores por defecto para fecha/hora
    const payload: BookingPayload = {
      nombre_cliente: name,
      telefono_cliente: phone,
      servicio_id: service.id,
      servicio_nombre: service.name,
      precio: service.price,
      fecha_hora: service.category === 'Productos' ? '2026-01-01 00:00' : `${selectedDate} ${selectedTime}`,
      barbero_id: service.category === 'Productos' ? 'V-CIOUS' : (selectedPro?.id || 'N/A'),
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
      console.error("Webhook error:", error);
      setStep('CONFIRMATION');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // ... (Manten el resto de la UI pero asegúrate de quitar 'grayscale' en las imágenes de los barberos)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold tracking-tight">Agendar Cita</h2>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Steps Progress (Simple Dots) */}
        {step !== 'CONFIRMATION' && (
           <div className="flex gap-2 px-6 pt-4">
             {[1, 2, 3, 4].map(i => (
               <div 
                key={i} 
                className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                  (step === 'SELECT_PROFESSIONAL' && i === 1) ||
                  (step === 'SELECT_DATE' && i <= 2) ||
                  (step === 'SELECT_TIME' && i <= 3) ||
                  (step === 'ENTER_DETAILS' && i <= 4) 
                  ? 'bg-[#A855F7]' 
                  : 'bg-gray-100'
                }`}
               />
             ))}
           </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          
          {/* Summary of what is being booked */}
          {step !== 'CONFIRMATION' && (
            <div className="mb-6 p-4 bg-gray-50 border-l-2 border-[#A855F7]">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Servicio</p>
              <p className="font-bold text-lg">{service.name}</p>
              <p className="text-sm text-gray-600">{service.duration} • ${service.price}</p>
            </div>
          )}

          {/* STEP 1: Professional */}
          {step === 'SELECT_PROFESSIONAL' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium mb-4">Selecciona Profesional</h3>
              {PROFESSIONALS.map((pro) => (
                <button
                  key={pro.id}
                  onClick={() => {
                    setSelectedPro(pro);
                    setStep('SELECT_DATE');
                  }}
                  className={`w-full flex items-center gap-4 p-4 border rounded-sm transition-all duration-200 group text-left ${
                    selectedPro?.id === pro.id 
                      ? 'border-[#A855F7] bg-purple-50' 
                      : 'border-gray-200 hover:border-black'
                  }`}
                >
                  <img src={pro.avatar} alt={pro.name} className="w-12 h-12 rounded-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                  <div>
                    <p className="font-bold">{pro.name}</p>
                    <p className="text-sm text-gray-500">Barbero Senior</p>
                  </div>
                  <ChevronRight className="ml-auto text-gray-300 group-hover:text-black" size={20} />
                </button>
              ))}
            </div>
          )}

          {/* STEP 2: Date */}
          {step === 'SELECT_DATE' && (
            <div className="space-y-4">
               <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setStep('SELECT_PROFESSIONAL')} className="text-gray-400 hover:text-black"><ChevronLeft size={20}/></button>
                <h3 className="text-lg font-medium">Elige el día</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {nextDays.map((date) => {
                  const dateStr = date.toLocaleDateString('es-MX', { weekday: 'short', day: 'numeric', month: 'short' });
                  const isoDate = date.toISOString().split('T')[0];
                  return (
                    <button
                      key={isoDate}
                      onClick={() => {
                        setSelectedDate(isoDate);
                        setStep('SELECT_TIME');
                      }}
                      className={`p-3 border rounded-sm text-center text-sm transition-all duration-200 ${
                        selectedDate === isoDate
                          ? 'bg-black text-white border-black'
                          : 'border-gray-200 hover:border-[#A855F7] hover:text-[#A855F7]'
                      }`}
                    >
                      <span className="block capitalize font-bold text-base mb-1">
                        {date.toLocaleDateString('es-MX', { weekday: 'short' }).replace('.', '')}
                      </span>
                      <span className="block text-xs">
                        {date.getDate()} {date.toLocaleDateString('es-MX', { month: 'short' })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: Time */}
          {step === 'SELECT_TIME' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setStep('SELECT_DATE')} className="text-gray-400 hover:text-black"><ChevronLeft size={20}/></button>
                <h3 className="text-lg font-medium">Elige la hora</h3>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {TIME_SLOTS.map((time) => (
                  <button
                    key={time}
                    onClick={() => {
                      setSelectedTime(time);
                      setStep('ENTER_DETAILS');
                    }}
                    className={`py-3 border rounded-sm text-sm font-medium transition-all duration-200 ${
                      selectedTime === time
                        ? 'bg-black text-white border-black'
                        : 'border-gray-200 hover:border-[#A855F7] hover:text-[#A855F7]'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Details */}
          {step === 'ENTER_DETAILS' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={() => setStep('SELECT_TIME')} className="text-gray-400 hover:text-black"><ChevronLeft size={20}/></button>
                <h3 className="text-lg font-medium">Tus Datos</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Nombre Completo</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full py-3 border-b border-gray-200 focus:border-[#A855F7] outline-none transition-colors font-medium text-lg"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-gray-500 mb-1">Teléfono (WhatsApp)</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. 55 1234 5678"
                    className="w-full py-3 border-b border-gray-200 focus:border-[#A855F7] outline-none transition-colors font-medium text-lg"
                  />
                </div>
              </div>

              <button
                disabled={!name || !phone || isSubmitting}
                onClick={handleBook}
                className={`w-full py-4 mt-6 text-white font-bold tracking-widest text-sm uppercase transition-all duration-300 ${
                  !name || !phone || isSubmitting
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-black hover:bg-[#A855F7]'
                }`}
              >
                {isSubmitting ? 'Procesando...' : 'Confirmar Cita'}
              </button>
            </div>
          )}

          {/* STEP 5: Success */}
          {step === 'CONFIRMATION' && (
            <div className="flex flex-col items-center justify-center h-full text-center py-8 animate-in fade-in zoom-in duration-300">
              <div className="w-20 h-20 bg-[#A855F7] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-purple-200">
                <CheckCircle className="text-white" size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-2">¡Cita Solicitada!</h2>
              <p className="text-gray-600 mb-8 max-w-xs mx-auto">
                El <span className="font-bold text-[#A855F7]">Fachebot</span> te confirmará por mensaje en breve.
              </p>
              
              <div className="bg-gray-50 p-6 rounded-sm w-full mb-6 text-left border border-gray-100">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 text-sm">Servicio</span>
                  <span className="font-medium text-sm">{service.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 text-sm">Barbero</span>
                  <span className="font-medium text-sm">{selectedPro?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500 text-sm">Fecha</span>
                  <span className="font-medium text-sm">{selectedDate} - {selectedTime}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="text-sm font-bold underline hover:text-[#A855F7] transition-colors"
              >
                Cerrar y volver al inicio
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default BookingModal;
