import { Service, Professional } from './types';

// Webhook de tu Raspberry Pi / n8n
export const N8N_WEBHOOK_URL = 'https://n8n.dimotic.uk/webhook/facheritos';

export const CATEGORIES = ['Todos', 'Cortes', 'Barba', 'Combos', 'Faciales', 'Productos'];

export const SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Corte Clásico Facherito',
    duration: 'Corte tradicional con tijera y máquina para un look impecable y profesional.',
    price: 200,
    category: 'Cortes',
    image: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1766325624/ads_1_xqhicf.jpg',
  },
  {
    id: 's2',
    name: 'Fade / Degradado',
    duration: 'Técnica de desvanecido preciso que resalta las facciones y da un estilo moderno.',
    price: 250,
    category: 'Cortes',
    image: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1765406174/ee954490-c9ef-467e-b910-a1c18db59335.png',
  },
  {
    id: 's3',
    name: 'Perfilado de Barba',
    duration: 'Definición de líneas con navaja para una barba simétrica y bien cuidada.',
    price: 100,
    category: 'Barba',
    image: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1765406114/ec5c2f9c-4cf4-42b6-9816-ce378c3a0a38.png',
  },
  {
    id: 's4',
    name: 'Barba con Toalla Caliente',
    duration: 'Experiencia relajante que abre los poros para un afeitado suave y sin irritación.',
    price: 150,
    category: 'Barba',
    image: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1765406089/9d2a96d9-0d5a-4cf9-bf13-f35d687e4966.png',
  },
  {
    id: 's5',
    name: 'Combo Corte + Barba',
    duration: 'Renovación total de imagen combinando nuestro mejor corte y cuidado de barba.',
    price: 300,
    category: 'Combos',
    image: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1765406165/7801e549-2c32-471d-b259-f5c1099f1636.png',
  },
  {
    id: 's6',
    name: 'Facial Exfoliante',
    duration: 'Limpieza profunda que elimina células muertas y deja la piel fresca y renovada.',
    price: 200,
    category: 'Faciales',
    image: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1766326408/Captura_de_pantalla_2025-12-21_081105_i9oqta.png',
  },
  {
    id: 's7',
    name: 'Black Mask Deluxe',
    duration: 'Mascarilla purificante que extrae impurezas y puntos negros para un cutis liso.',
    price: 300,
    category: 'Faciales',
    image: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1767628575/Macarilla_2_bjtdqv.png',
  },
  // --- SECCIÓN DE PRODUCTOS ---
  {
    id: 'prod1',
    name: 'Cera 4x4',
    duration: 'Aporta fijación flexible y un aspecto natural sin dejar residuos grasosos.',
    price: 180,
    category: 'Productos',
    image: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1768572787/CERA_szshi8.png', 
  },
  {
    id: 'prod2',
    name: 'Pasta 4x4',
    duration: 'Ideal para estilos estructurados con un acabado mate que dura todo el día.',
    price: 180,
    category: 'Productos',
    image: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1768572834/CERA_2_dlxtsg.png',
  },
  {
    id: 'prod3',
    name: 'Pomada 4x4',
    duration: 'Logra un brillo impecable y control total para peinados clásicos y relamidos.',
    price: 180,
    category: 'Productos',
    image: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1768572794/CERA_1_hbenou.png',
  },
 {
    id: 'vc1',
    name: 'Playera Mazda RX-7 Urban',
    duration: 'Corte Premium - 100% Algodón',
    price: 200,
    category: 'Productos',
    image: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1769182385/MAZDA_RZ-7_c1r4fo.jpg',
    sizes: ['M', 'L', 'XL'], // Tallas disponibles
    mpLink: 'https://mpago.la/tu-link-mazda' // Link de Checkout Pro
  },
  {
    id: 'vc2',
    name: 'Playera McLaren 720S Abstract',
    duration: 'Estilo Psicodélico - Edición Limitada',
    price: 200,
    category: 'Productos',
    image: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1769182385/MCLAREN_tfj5kh.jpg',
    sizes: ['M', 'L', 'XL'],
    mpLink: 'https://mpago.la/tu-link-mclaren'
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
