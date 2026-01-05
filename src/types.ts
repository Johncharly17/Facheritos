export interface Service {
  id: string;
  name: string;
  duration: string; // e.g., "45 min"
  price: number;
  category: 'Cortes' | 'Barba' | 'Combos' | 'Faciales';
  image: string;
}

export interface Professional {
  id: string;
  name: string;
  avatar: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface BookingPayload {
  nombre_cliente: string;
  telefono_cliente: string;
  servicio_id: string;
  servicio_nombre: string;
  precio: number;
  fecha_hora: string; // ISO string or formatted string
  barbero_id: string;
  source: 'web';
}

export type BookingStep = 'SELECT_PROFESSIONAL' | 'SELECT_DATE' | 'SELECT_TIME' | 'ENTER_DETAILS' | 'CONFIRMATION';