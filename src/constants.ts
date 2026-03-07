import { Service, Professional } from './types';

// Webhook de tu Raspberry Pi / n8n
export const N8N_WEBHOOK_URL = 'https://n8n.dimotic.uk/webhook/facheritos';

export const CATEGORIES = ['Todos', 'Cortes', 'Barba', 'Combos', 'Faciales', 'Productos'];

export const SERVICES: Service[] = [
  {
    id: 'dd591458-4485-476c-9ebe-7259a2440c9c',
    name: 'Corte Clásico Facherito',
    duration: 'Corte tradicional con tijera y máquina para un look impecable y profesional.',
    price: 200,
    category: 'Cortes',
    image: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1766325624/ads_1_xqhicf.jpg',
  },
  {
    id: '4982db3d-e842-42cd-8509-1e80545c671e',
    name: 'Perfilado de Barba',
    duration: 'Definición de líneas con navaja para una barba simétrica y bien cuidada.',
    price: 100,
    category: 'Barba',
    image: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1765406114/ec5c2f9c-4cf4-42b6-9816-ce378c3a0a38.png',
  },
  {
    id: '08eb0c2d-1cad-4ba2-a5a0-f499cd90fad4',
    name: 'Facial Exfoliante',
    duration: 'Limpieza profunda que elimina células muertas y deja la piel fresca y renovada.',
    price: 250,
    category: 'Faciales',
    image: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1766326408/Captura_de_pantalla_2025-12-21_081105_i9oqta.png',
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
    id: 'f5b018a0-82ac-448a-8426-acac6363325d',
    name: 'Manuel Soprano',
    avatar: 'https://res.cloudinary.com/dqwslpah7/image/upload/v1767629608/manuel-soprano_ptimyv.jpg',
  },
];

export const TIME_SLOTS = [
  '13:00', '15:00', '16:00', '17:00', '18:00'
];

export const COMPANY_INFO = {
  address: '📍 Tampico Cañada, México',
  mapsUrl: 'https://maps.app.goo.gl/yyQJp5Y9QSi6R7f68',
  hours: 'Lun - Sáb: 1:00 PM - 6:00 PM',
  instagram: 'https://www.instagram.com/facheritos_barbershop_/',
  facebook: 'https://www.facebook.com/profile.php?id=100063746555701',
};
