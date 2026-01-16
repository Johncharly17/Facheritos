import { Service, Professional } from './types';

// Webhook de tu Raspberry Pi / n8n
export const N8N_WEBHOOK_URL = 'https://n8n.dimotic.uk/webhook/facheritos';

export const CATEGORIES = ['Todos', 'Cortes', 'Barba', 'Combos', 'Faciales', 'Productos'];

export const SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Corte Clásico Facherito',
    duration: '45 min',
    price: 200,
    category: 'Cortes',
    image: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1766325624/ads_1_xqhicf.jpg',
  },
  {
    id: 's2',
    name: 'Fade / Degradado',
    duration: '60 min',
    price: 250,
    category: 'Cortes',
    image: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1765406174/ee954490-c9ef-467e-b910-a1c18db59335.png',
  },
  {
    id: 's3',
    name: 'Perfilado de Barba',
    duration: '30 min',
    price: 100,
    category: 'Barba',
    image: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1765406114/ec5c2f9c-4cf4-42b6-9816-ce378c3a0a38.png',
  },
  {
    id: 's4',
    name: 'Barba con Toalla Caliente',
    duration: '45 min',
    price: 150,
    category: 'Barba',
    image: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1765406089/9d2a96d9-0d5a-4cf9-bf13-f35d687e4966.png',
  },
  {
    id: 's5',
    name: 'Combo Corte + Barba',
    duration: '90 min',
    price: 300,
    category: 'Combos',
    image: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1765406165/7801e549-2c32-471d-b259-f5c1099f1636.png',
  },
  {
    id: 's6',
    name: 'Facial Exfoliante',
    duration: '30 min',
    price: 200,
    category: 'Faciales',
    image: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1766326408/Captura_de_pantalla_2025-12-21_081105_i9oqta.png',
  },
  {
    id: 's7',
    name: 'Black Mask Deluxe',
    duration: '40 min',
    price: 300,
    category: 'Faciales',
    image: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1767628575/Macarilla_2_bjtdqv.png',
  },
  // --- SECCIÓN DE PRODUCTOS ---
  {
    id: 'prod1',
    name: 'Cera 4x4',
    duration: 'Moldea tu estilo sin tanta opacidad',
    price: 180,
    category: 'Productos',
    image: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1768572787/CERA_szshi8.png', 
  },
  {
    id: 'prod2',
    name: 'Pasta 4x4',
    duration: 'Fija tu estilo y dura todo el día!',
    price: 180,
    category: 'Productos',
    image: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1768572834/CERA_2_dlxtsg.png',
  },
  {
    id: 'prod3',
    name: 'Pomada 4x4',
    duration: 'Dale brillo a tu look',
    price: 180,
    category: 'Productos',
    image: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1768572794/CERA_1_hbenou.png',
  },
];

// Solo un export de PROFESSIONALS
export const PROFESSIONALS: Professional[] = [
  {
    id: 'p1',
    name: 'Manuel Soprano',
    avatar: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1767629608/manuel-soprano_ptimyv.jpg',
  },
];

export const TIME_SLOTS = [
  '10:00', '11:00', '12:00', '13:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

export const COMPANY_INFO = {
  address: '📍 Tampico Cañada, México',
  mapsUrl: 'https://maps.app.goo.gl/yyQJp5Y9QSi6R7f68',
  hours: 'Lun - Sáb: 10:00 AM - 8:00 PM',
  instagram: 'https://www.instagram.com/facheritos_barbershop_/',
  facebook: 'https://www.facebook.com/profile.php?id=100063746555701',
};
