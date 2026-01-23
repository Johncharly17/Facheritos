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
  const [selectedSize, setSelectedSize] = useState<string | null>(null); // Estado para la talla
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (service.category === 'Productos') {
        // Si tiene tallas, vamos a seleccionar talla; si no (ceras), directo a datos
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
      talla: selectedSize || 'N/A', // Enviamos la talla seleccionada
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

      // Si es un producto con link de pago, redirigimos tras avisar a n8n
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-white shadow-2xl flex flex-col max-h-[90vh] z-[110] rounded-sm">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold tracking-tight uppercase italic">
            {service.category === 'Productos' ? 'Checkout V-cious' : 'Agendar Cita'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Resumen del Item */}
          {step !== 'CONFIRMATION' && (
            <div className="mb-6 p-4 bg-gray-50 border-l-2 border-[#A855F7] flex gap-4 items-center">
              <img src={service.image} className="w-16 h-16 object-cover rounded-sm" alt="Preview" />
              <div>
                <p className="font-black text-sm uppercase italic">{service.name}</p>
                <p className="text-xl font-black text-[#A855F7]">${service.price}</p>
              </div>
            </div>
          )}

          {/* PASO: SELECCIÓN DE TALLA (Solo para ropa) */}
          {step === 'SELECT_SIZE' && (
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Selecciona tu Talla:</h3>
              <div className="grid grid-cols-3 gap-3">
                {service.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => { setSelectedSize(size); setStep('ENTER_DETAILS'); }}
                    className="py-4 border-2 border-black font-black hover:bg-[#A855F7] hover:border-[#A855F7] hover:text-white transition-all uppercase"
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ... Aquí irían los pasos de Barbero/Fecha/Hora (se mantienen igual que tu código anterior) ... */}

          {/* PASO FINAL: DATOS */}
          {step === 'ENTER_DETAILS' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                {service.category !== 'Productos' && (
                    <button onClick={() => setStep('SELECT_TIME')} className="text-gray-400 hover:text-black"><ChevronLeft size={20}/></button>
                )}
                <h3 className="text-lg font-medium italic">Datos para tu comprobante</h3>
              </div>
              <div className="space-y-4">
                <input type="text" placeholder="Tu Nombre" value={name} onChange={e => setName(e.target.value)} className="w-full py-3 border-b outline-none focus:border-[#A855F7] font-medium" />
                <input type="tel" placeholder="WhatsApp (10 dígitos)" value={phone} onChange={e => setPhone(e.target.value)} className="w-full py-3 border-b outline-none focus:border-[#A855F7] font-medium" />
              </div>
              <button 
                onClick={handleBook}
                disabled={!name || !phone || isSubmitting}
                className="w-full py-4 bg-black text-white font-bold uppercase hover:bg-[#A855F7] transition-all tracking-widest flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Procesando...' : (service.category === 'Productos' ? 'Pagar en Mercado Pago' : 'Confirmar Cita')}
                {service.category === 'Productos' && <ShoppingBag size={18} />}
              </button>
            </div>
          )}

          {/* ÉXITO (Para citas) */}
          {step === 'CONFIRMATION' && (
            <div className="text-center py-10">
              <CheckCircle className="mx-auto text-[#A855F7] mb-4" size={60} />
              <h2 className="text-2xl font-bold">¡Solicitud Enviada!</h2>
              <p className="text-gray-600 mt-2">El Fachebot te contactará por WhatsApp.</p>
              <button onClick={onClose} className="mt-8 font-bold underline">Cerrar</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
