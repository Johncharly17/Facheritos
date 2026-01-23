export interface Service {
  id: string;
  name: string;
  duration: string;
  price: number;
  category: 'Cortes' | 'Barba' | 'Combos' | 'Faciales' | 'Productos'; // Añadido Productos
  image: string;
  sizes?: string[]; // Cambiado a array para manejar varias tallas (M, L, XL)
  mpLink?: string;  // El link de Checkout Pro de Mercado Pago
}

export interface Professional {
  id: string;
  name: string;
  avatar: string;
}

export interface BookingPayload {
  nombre_cliente: string;
  telefono_cliente: string;
  servicio_id: string;
  servicio_nombre: string;
  precio: number;
  fecha_hora: string;
  barbero_id: string;
  talla?: string; // Nuevo: Para saber qué talla compraron
  source: 'web';
}

// Añadido 'SELECT_SIZE' al flujo
export type BookingStep = 'SELECT_PROFESSIONAL' | 'SELECT_DATE' | 'SELECT_TIME' | 'SELECT_SIZE' | 'ENTER_DETAILS' | 'CONFIRMATION';
