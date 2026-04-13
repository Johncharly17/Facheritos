import React, { useState, useMemo, useEffect } from 'react';
import { Service, Professional } from '../types';
import { SERVICES, PROFESSIONALS, TIME_SLOTS, COMPANY_INFO, N8N_WEBHOOK_URL } from '../constants';
import { supabase } from '../lib/supabase';

const HERO_IMAGES = [
  "https://res.cloudinary.com/dqwslpah7/image/upload/q_auto/f_auto/v1776016211/facheritos_local_v6pv7f.jpg",
  "https://res.cloudinary.com/dqwslpah7/image/upload/q_auto/f_auto/v1776004728/facheritos_barber_j93fa6.jpg",
  "https://res.cloudinary.com/dqwslpah7/image/upload/q_auto/f_auto/v1776017374/page_5_fm61uu.jpg",
  "https://res.cloudinary.com/dqwslpah7/image/upload/q_auto/f_auto/v1776017373/page_11_urhbvi.jpg",
  "https://res.cloudinary.com/dqwslpah7/image/upload/q_auto/f_auto/v1776017373/page_4_untcty.jpg",
  "https://res.cloudinary.com/dqwslpah7/image/upload/q_auto/f_auto/v1776017376/page_7_twxfes.jpg",
  "https://res.cloudinary.com/dqwslpah7/image/upload/q_auto/f_auto/v1776017375/page_6_rerej8.jpg",
  "https://res.cloudinary.com/dqwslpah7/image/upload/q_auto/f_auto/v1776017376/page_8_fysjlr.jpg",
  "https://res.cloudinary.com/dqwslpah7/image/upload/q_auto/f_auto/v1776017378/page_10_yivz1w.jpg",
  "https://res.cloudinary.com/dqwslpah7/image/upload/q_auto/f_auto/v1776016189/page_1_mrj3tt.jpg",
  "https://res.cloudinary.com/dqwslpah7/image/upload/q_auto/f_auto/v1776017085/page_3_lphkdx.jpg",
  "https://res.cloudinary.com/dqwslpah7/image/upload/q_auto/f_auto/v1776017377/page_9_g7eupb.jpg"
];

const getNext7Days = () => {
  const days = [];
  const today = new Date();
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push({
      id: d.toISOString().split('T')[0],
      dayName: i === 0 ? 'Hoy' : dayNames[d.getDay()],
      dayNumber: d.getDate(),
      month: d.toLocaleString('es-MX', { month: 'short' })
    });
  }
  return days;
};

const NEXT_DAYS = getNext7Days();

const BarberPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [viewingService, setViewingService] = useState<Service | null>(null);
  const [bookedTimes, setBookedTimes] = useState<string[]>([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [showDataModal, setShowDataModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex(prev => (prev + 1) % HERO_IMAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchBookings() {
      if (!selectedDate) {
        setBookedTimes([]);
        return;
      }
      const tenant_id = '9f29904e-4490-4a37-b58f-2752ca528114';
      
      const { data, error } = await supabase.from('appointments')
        .select('start_time')
        .eq('tenant_id', tenant_id)
        .gte('start_time', `${selectedDate}T00:00:00.000Z`)
        .lte('start_time', `${selectedDate}T23:59:59.999Z`);
        
      if (data) {
        const times = data.map(appt => {
          const d = new Date(appt.start_time);
          const hrs = d.getHours().toString().padStart(2, '0');
          const mins = d.getMinutes().toString().padStart(2, '0');
          return `${hrs}:${mins}`;
        });
        setBookedTimes(times);
      }
    }
    fetchBookings();
  }, [selectedDate, showSuccess]);

  const filteredServices = useMemo(() => {
    return SERVICES.filter(s => s.category !== 'Productos');
  }, []);

  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedProfessional || !selectedDate || !selectedTime) {
      alert("Por favor completa los pasos previos.");
      return;
    }
    if (!clientName || !clientPhone || clientPhone.length < 10) {
      alert("Por favor ingresa tu nombre y un número de teléfono válido a 10 dígitos.");
      return;
    }

    setIsSubmitting(true);
    try {
      const tenant_id = '9f29904e-4490-4a37-b58f-2752ca528114';
      const formattedPhone = clientPhone.startsWith('52') ? clientPhone : `52${clientPhone}`;
      
      let customerId = '';
      const { data: qCustomer } = await supabase.from('customers')
        .select('id').eq('phone', formattedPhone).eq('tenant_id', tenant_id).maybeSingle();
      
      if (qCustomer?.id) {
        customerId = qCustomer.id;
      } else {
        const { data: nCustomer, error } = await supabase.from('customers').insert({
          tenant_id,
          full_name: clientName,
          phone: formattedPhone
        }).select('id').single();
        if (nCustomer?.id) customerId = nCustomer.id;
      }

      if (customerId) {
        const startStr = `${selectedDate}T${selectedTime}:00`;
        const startDate = new Date(startStr);
        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

        await supabase.from('appointments').insert({
          tenant_id,
          customer_id: customerId,
          staff_id: selectedProfessional.id,
          service_id: selectedService.id,
          start_time: startDate.toISOString(),
          end_time: endDate.toISOString(),
          status: 'pending',
          final_price: selectedService.price,
          is_express: false
        });
      }

      try {
        await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            client_name: clientName,
            client_phone: clientPhone,
            service: selectedService?.name,
            staff: selectedProfessional?.name,
            date: selectedDate,
            time: selectedTime,
            price: selectedService?.price,
            tenant_id: tenant_id,
            timestamp: new Date().toISOString()
          })
        });
      } catch (e) {
        console.error("Webhook error:", e);
      }

      setShowDataModal(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedService(null);
        setSelectedProfessional(null);
        setSelectedDate(null);
        setSelectedTime(null);
        setClientName('');
        setClientPhone('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 4000);

    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al reservar. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStep = (!selectedService) ? 1 : (!selectedProfessional) ? 2 : (!selectedDate || !selectedTime) ? 3 : 4;

  return (
    <div className="flex h-screen w-full bg-background text-on-surface font-body selection:bg-primary-container selection:text-white overflow-hidden m-0 p-0">
      {/* LEFT SIDE: 40% FIXED HERO */}
      <aside className="hidden md:flex md:w-[40%] h-full relative overflow-hidden shrink-0">
        <div className="absolute inset-0 z-0 bg-black">
          {HERO_IMAGES.map((img, idx) => (
            <img
              key={img}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[2000ms] ease-in-out ${idx === currentHeroIndex ? 'opacity-60' : 'opacity-0'}`}
              alt={`Barbershop ambient ${idx + 1}`}
              src={img}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-tr from-surface via-surface/40 to-primary-container/20 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-12 lg:p-20">
          <div className="flex items-center space-x-4">
            <div className="w-5 h-20 rounded-full barber-pole border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
            <div className="space-y-1">
              <span className="font-elegant italic font-medium tracking-wide text-6xl lg:text-7xl text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">Facheritos</span>
              <div className="h-0.5 w-32 bg-white/60"></div>
            </div>
          </div>
          <div className="space-y-6">
            <h1 className="font-headline font-extrabold text-5xl lg:text-7xl leading-tight text-white tracking-tight">
              Reserva <br /> <span className="text-primary-fixed-dim">tu estilo</span>
            </h1>
            <p className="text-secondary max-w-sm font-light tracking-wide leading-relaxed">
              Experiencia de barbería premium donde los hombres se sienten como hombres.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="material-symbols-outlined text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
            <span className="font-label uppercase tracking-widest text-xs text-white/80">Since 2022</span>
          </div>
        </div>
      </aside>

      {/* RIGHT SIDE: 60% SCROLLABLE CONTENT */}
      <main className="w-full md:w-[60%] h-full bg-surface overflow-y-auto custom-scrollbar relative flex flex-col">
        {/* TopNavBar */}
        <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-8 py-4 bg-[#131313]/80 backdrop-blur-xl border-none bg-gradient-to-b from-black/20 to-transparent md:w-[60%] md:right-0">
          <div className="font-elegant italic font-medium tracking-wide text-3xl text-white md:hidden drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">Facheritos</div>
          <div className="hidden lg:flex items-center space-x-8 ml-auto text-right w-full justify-end">
            <a className="font-headline uppercase tracking-[0.1em] text-sm text-white border-b-2 border-white pb-1 shadow-[0_4px_10px_rgba(255,255,255,0.3)]" href="#">Reserva</a>
            <a className="font-headline uppercase tracking-[0.1em] text-sm text-[#e5e2e1] hover:text-white transition-colors" href="#redes" onClick={(e) => { e.preventDefault(); document.getElementById('redes')?.scrollIntoView({ behavior: 'smooth' }); }}>Contáctanos</a>
          </div>
        </nav>

        {/* Dynamic Tracker Header */}
        <div className="pt-32 pb-4 px-6 md:px-12 lg:px-20 text-center flex flex-col items-center">
          <h2 className="font-headline text-3xl md:text-4xl font-extrabold tracking-widest uppercase text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] mb-4">
            {currentStep === 1 ? 'Elige tu Servicio' : currentStep === 2 ? 'Selecciona tu Barbero' : 'Fecha y Hora'}
          </h2>
          <div className="flex items-center justify-center gap-3">
            <div className={`h-1.5 w-12 sm:w-16 rounded-full transition-all duration-500 ${currentStep >= 1 ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'bg-white/10'}`}></div>
            <div className={`h-1.5 w-12 sm:w-16 rounded-full transition-all duration-500 ${currentStep >= 2 ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'bg-white/10'}`}></div>
            <div className={`h-1.5 w-12 sm:w-16 rounded-full transition-all duration-500 ${currentStep >= 3 ? 'bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'bg-white/10'}`}></div>
          </div>
        </div>

        {/* CONTENT CANVAS */}
        <div className="pb-12 px-6 md:px-12 lg:px-20 space-y-16 flex-grow">

          {/* Section: Services */}
          <section className={`space-y-8 transition-opacity duration-300 ${currentStep < 1 ? 'opacity-50 pointer-events-none' : ''}`}>
            <header className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-outline-variant/10 pb-4 gap-4">
              <h2 className="font-headline font-bold text-2xl uppercase tracking-widest text-white">Servicios</h2>
            </header>

            <div className="grid grid-cols-1 gap-4">
              {filteredServices.map(service => (
                <div
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`group relative bg-surface-container-low border p-6 flex justify-between items-center transition-all duration-500 neon-glow-hover cursor-pointer overflow-hidden ${selectedService?.id === service.id ? 'border-white shadow-[0_0_20px_2px_rgba(255,255,255,0.5)]' : 'border-secondary/20'
                    }`}
                >
                  <div className={`absolute left-0 top-0 h-full w-0.5 bg-white transition-transform duration-300 ${selectedService?.id === service.id ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100 shadow-[0_0_10px_rgba(255,255,255,1)]'}`}></div>
                  <div className="flex items-center gap-6">
                    <img className="w-16 h-16 rounded-sm object-cover transition-all duration-500" alt={service.name} src={service.image} />
                    <div className="space-y-1">
                      <h3 className={`font-headline font-bold text-lg tracking-wide transition-colors ${selectedService?.id === service.id ? 'text-white' : 'text-[#e5e2e1]'}`}>{service.name}</h3>
                      <p className="text-sm text-secondary font-light max-w-[200px] truncate sm:max-w-xs">{service.duration}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className="block font-headline text-xl text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">${service.price}</span>
                    <button
                      onClick={(e) => { e.stopPropagation(); setViewingService(service); }}
                      className="text-[10px] font-label uppercase tracking-widest text-secondary hover:text-white border-b border-transparent hover:border-white transition-all"
                    >
                      Ver Detalle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Barber Selection */}
          <section className={`space-y-8 transition-opacity duration-300`}>
            <header className="flex items-end justify-between border-b border-outline-variant/10 pb-4">
              <h2 className="font-headline font-bold text-2xl uppercase tracking-widest text-white">Staff</h2>
            </header>
            <div className="flex flex-wrap gap-8">
              {PROFESSIONALS.map(pro => (
                <button
                  key={pro.id}
                  onClick={() => setSelectedProfessional(pro)}
                  className={`flex flex-col items-center gap-4 group transition-all duration-300 ${selectedProfessional?.id === pro.id
                    ? 'opacity-100 grayscale-0'
                    : selectedProfessional ? 'opacity-50 grayscale hover:grayscale-0 hover:opacity-100' : 'opacity-100 hover:scale-105'
                    }`}
                >
                  <div className={`relative p-1 rounded-full border-2 transition-colors duration-300 ${selectedProfessional?.id === pro.id
                    ? 'border-white ring-4 ring-white/30 shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                    : 'border-transparent group-hover:border-white/50 group-hover:shadow-[0_0_10px_rgba(255,255,255,0.2)]'
                    }`}>
                    <img className="w-24 h-24 object-cover rounded-full" alt={pro.name} src={pro.avatar} />
                  </div>
                  <div className="text-center">
                    <p className={`font-headline font-bold transition-colors drop-shadow-[0_0_5px_rgba(255,255,255,0.3)] ${selectedProfessional?.id === pro.id ? 'text-white' : 'text-secondary group-hover:text-white'
                      }`}>{pro.name.split(' ')[0]}</p>
                    <p className="text-[10px] text-outline uppercase tracking-widest">Master Barber</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Section: Date & Time Selection */}
          <section className={`space-y-8 transition-opacity duration-300`}>
            <header className="flex items-end justify-between border-b border-outline-variant/10 pb-4">
              <h2 className="font-headline font-bold text-2xl uppercase tracking-widest text-white">Fecha y Hora</h2>
            </header>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-secondary font-label uppercase tracking-widest text-[10px] mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.05)]">1. Elige el Día</h3>
                <div className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar snap-x">
                  {NEXT_DAYS.map(day => (
                    <button
                      key={day.id}
                      onClick={() => setSelectedDate(day.id)}
                      className={`min-w-[70px] sm:min-w-[80px] shrink-0 py-4 flex flex-col items-center justify-center border-2 rounded-md transition-all duration-300 snap-center ${selectedDate === day.id
                          ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.6)] scale-105'
                          : 'bg-transparent border-white/20 text-[#e5e2e1] hover:border-white/60 hover:bg-white/5'
                        }`}
                    >
                      <span className="text-[9px] uppercase font-label tracking-widest mb-1">{day.dayName}</span>
                      <span className="text-xl sm:text-2xl font-headline font-bold">{day.dayNumber}</span>
                      <span className="text-[9px] uppercase font-label tracking-widest mt-1 opacity-70">{day.month}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className={`transition-all duration-500`}>
                <h3 className="text-secondary font-label uppercase tracking-widest text-[10px] mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.05)]">2. Elige la Hora</h3>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                  {TIME_SLOTS.map(time => {
                    const now = new Date();
                    const todayDateStr = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];
                    const isToday = selectedDate === todayDateStr;
                    
                    const [tHourStr, tMinStr] = time.split(':');
                    const tHour = parseInt(tHourStr, 10);
                    const tMin = parseInt(tMinStr, 10);
                    
                    const isPast = isToday && (tHour < now.getHours() || (tHour === now.getHours() && tMin < now.getMinutes()));
                    const isBooked = bookedTimes.includes(time);
                    const isDisabled = isPast || isBooked;

                    return (
                      <button
                        key={time}
                        disabled={isDisabled}
                        onClick={() => setSelectedTime(time)}
                        className={`relative overflow-hidden py-3 font-headline text-sm tracking-widest font-semibold transition-all duration-300 border-2 rounded-md ${
                          isDisabled
                            ? 'bg-black/20 border-white/5 text-white/20 cursor-not-allowed'
                            : selectedTime === time
                              ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.6)] scale-105'
                              : 'bg-transparent border-white/20 text-[#e5e2e1] hover:border-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <span className={isBooked || isPast ? 'opacity-30' : ''}>{time}</span>
                        {isBooked && (
                          <span className="absolute inset-0 flex items-center justify-center text-[9px] uppercase font-black tracking-widest text-white/50 bg-black/50 rotate-[-10deg]">
                            Reservado
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA triggering Data Modal */}
          <div className={`pt-8 transition-all duration-700 ${selectedService && selectedProfessional && selectedDate && selectedTime ? 'opacity-100 transform translate-y-0 scale-100' : 'opacity-0 pointer-events-none transform translate-y-4 scale-95 hidden'}`}>
            <button
              onClick={() => setShowDataModal(true)}
              className="w-full py-5 bg-white text-black font-headline font-extrabold uppercase tracking-[0.2em] text-sm hover:bg-gray-200 hover:shadow-[0_0_25px_rgba(255,255,255,0.6)] active:scale-[0.98] transition-all duration-300 rounded-sm"
            >
              Confirmar Reservación
            </button>
            <p className="text-center mt-4 text-[10px] text-outline uppercase tracking-widest font-light">Al confirmar, completaremos tus datos antes de agendar.</p>
          </div>

          {/* Section: Ubicación */}
          <section id="ubicacion" className="space-y-6 pt-16 border-t border-outline-variant/10">
            <header className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 gap-4">
              <h2 className="font-headline font-bold text-2xl uppercase tracking-widest text-white">Ubícanos</h2>
              <span className="text-xs font-label text-secondary uppercase tracking-tighter">Visítanos</span>
            </header>
            <div className="w-full h-80 rounded-lg overflow-hidden border border-white/20 bg-surface-container-lowest relative group">
              <a
                href="https://www.google.com/maps/place/Facheritos/@22.2856901,-97.881436,20z/data=!4m6!3m5!1s0x85d7fb0008865da3:0xa0dc72fcca2dda32!8m2!3d22.285566!4d-97.8815228!16s%2Fg%2F11x7lph2_c?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noreferrer"
                className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 group-hover:bg-black/20 backdrop-blur-0 transition-all cursor-pointer"
                title="Abrir en Google Maps"
              >
              </a>
              <iframe
                title="Google Maps"
                src="https://maps.google.com/maps?q=22.285566,-97.8815228&t=m&z=17&output=embed"
                className="w-full h-full border-0 pointer-events-none"
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </section>

          {/* Section: Contáctanos */}
          <section id="redes" className="space-y-6 pt-16 border-t border-outline-variant/10 pb-8">
            <header className="flex flex-col sm:flex-row sm:items-end justify-between pb-4 gap-4">
              <h2 className="font-headline font-bold text-2xl uppercase tracking-widest text-white">Contáctanos</h2>
              <span className="text-xs font-label text-secondary uppercase tracking-tighter">Conéctate</span>
            </header>
            <div className="flex gap-8 justify-center">
              <a href="https://www.instagram.com/facheritos_barbershop?igsh=MThoOTZyMjhkendkZA==" target="_blank" rel="noreferrer" className="group flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:border-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all bg-surface-container-low">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 opacity-70 group-hover:opacity-100 transition-all"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                </div>
                <span className="text-xs font-label text-secondary group-hover:text-white transition-colors">Instagram</span>
              </a>
              <a href="https://www.facebook.com/share/1GLXa7ghZD/?mibextid=wwXIfr" target="_blank" rel="noreferrer" className="group flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:border-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all bg-surface-container-low">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 opacity-70 group-hover:opacity-100 transition-all"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
                <span className="text-xs font-label text-secondary group-hover:text-white transition-colors">Facebook</span>
              </a>
              <a href={`https://wa.me/528333268025?text=Hola!%20vengo%20de%20tu%20web%20Facheritos`} target="_blank" rel="noreferrer" className="group flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white group-hover:border-white group-hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] transition-all bg-surface-container-low">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 opacity-70 group-hover:opacity-100 transition-all"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.663-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                </div>
                <span className="text-xs font-label text-secondary group-hover:text-white transition-colors">WhatsApp</span>
              </a>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="w-full py-8 mt-auto bg-[#0e0e0e] tonal-shift-bg flex justify-center items-center px-12">
          <p className="font-body text-xs font-light tracking-widest uppercase text-white/50 text-center">Desarrollado por Dimotic Automation</p>
        </footer>
      </main>

      {/* Service Details Modal Overlay */}
      {viewingService && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-[#0e0e0e] border border-white/20 w-full max-w-lg rounded-xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.15)] relative flex flex-col">
            <button
              onClick={() => setViewingService(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xl hover:bg-white hover:text-black transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
            <div className="relative h-64 sm:h-80 w-full shrink-0">
              <img src={viewingService.image} alt={viewingService.name} className="w-full h-full object-cover transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/40 to-transparent"></div>
            </div>
            <div className="p-8 space-y-4">
              <h3 className="font-headline text-3xl text-white font-bold tracking-wide">{viewingService.name}</h3>
              <p className="text-secondary font-light leading-relaxed">{viewingService.duration}</p>
              <div className="pt-6 flex justify-between items-center border-t border-white/10 mt-6">
                <span className="font-headline text-2xl font-bold text-white">${viewingService.price} <span className="text-xs font-label text-secondary uppercase tracking-widest font-light">MXN</span></span>
                <button
                  onClick={() => { setSelectedService(viewingService); setViewingService(null); }}
                  className="px-6 py-3 bg-white text-black font-headline text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors rounded-sm"
                >
                  Seleccionar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Entry Modal */}
      {showDataModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 sm:p-4 animate-in fade-in duration-300">
          <div className="bg-[#0e0e0e] border border-white/20 w-full max-w-sm rounded-xl overflow-hidden shadow-[0_0_40px_rgba(255,255,255,0.15)] relative flex flex-col p-8">
            <button
              onClick={() => setShowDataModal(false)}
              className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full border border-white/20 bg-transparent text-white hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
            
            <h3 className="font-headline text-2xl text-white font-bold tracking-widest uppercase mb-6 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">Tus Datos</h3>
            
            <div className="space-y-6">
              <div className="space-y-2 group">
                <label className="text-[10px] font-label uppercase text-secondary tracking-widest group-focus-within:text-white transition-colors">Nombre Completo</label>
                <input 
                  type="text" 
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ej. Juan Pérez" 
                  className="w-full bg-surface-container-lowest border border-white/20 rounded-md px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:border-white focus:bg-white/5 transition-all shadow-inner"
                />
              </div>
              <div className="space-y-2 group">
                <label className="text-[10px] font-label uppercase text-secondary tracking-widest group-focus-within:text-white transition-colors">Teléfono / WhatsApp</label>
                <div className="flex shadow-inner rounded-md overflow-hidden border border-white/20 focus-within:border-white transition-all">
                  <div className="bg-surface-container-high px-4 py-3 text-white font-headline text-sm flex items-center shrink-0 border-r border-white/20">
                    +52
                  </div>
                  <input 
                    type="tel" 
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
                    placeholder="55 1234 5678" 
                    className="w-full bg-surface-container-lowest px-4 py-3 text-white font-body text-sm placeholder:text-white/20 focus:outline-none focus:bg-white/5 transition-colors"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                handleConfirmBooking();
              }}
              disabled={clientName.length < 3 || clientPhone.length < 10 || isSubmitting}
              className="w-full py-4 mt-8 bg-white text-black font-headline font-extrabold uppercase tracking-[0.2em] text-sm hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none rounded-sm flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
              ) : (
                'Completar Reserva'
              )}
            </button>
            <p className="text-center mt-5 text-[9px] text-white/30 uppercase tracking-[0.3em] font-light italic opacity-60">OnlyK4$H</p>
          </div>
        </div>
      )}

      {/* Success View */}
      <div className={`fixed inset-0 z-[120] flex flex-col items-center justify-center bg-black/95 backdrop-blur-xl transition-all duration-700 ${showSuccess ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className={`flex flex-col items-center max-w-sm px-6 text-center transition-all duration-[1500ms] delay-300 transform ${showSuccess ? 'translate-y-0 scale-100' : 'translate-y-8 scale-95'}`}>
          <div className="w-20 h-20 mb-8 rounded-full border-2 border-white flex items-center justify-center text-white shadow-[0_0_40px_rgba(255,255,255,0.4)] animate-pulse">
            <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <h2 className="font-headline text-3xl font-black uppercase tracking-widest text-white mb-4">Agradecemos<br/><span className="text-white/60 font-light">Tu Preferencia</span></h2>
          <p className="text-sm text-secondary font-body font-light tracking-wide leading-relaxed">
            Tu reserva ha sido procesada con éxito y comunicada al equipo Facheritos Barbershop. Te esperamos.
          </p>
        </div>
      </div>

    </div>
  );
};

export default BarberPage;
