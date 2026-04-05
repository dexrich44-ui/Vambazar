import { Service, Vehicle } from "./types";

export const APP_NAME = "Vambazar Elite";
export const PRIMARY_COLOR = "#0f172a"; // Slate 900
export const ACCENT_COLOR = "#fbbf24"; // Amber 400
export const SECONDARY_COLOR = "#0d9488"; // Teal 600

export const VEHICLES: Vehicle[] = [
  {
    id: "v1",
    name: "Elite Económico",
    type: "economy",
    pricePerKm: 1.2,
    estimatedArrival: 4,
    capacity: 4,
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "v2",
    name: "Elite Premium",
    type: "premium",
    pricePerKm: 2.5,
    estimatedArrival: 6,
    capacity: 4,
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "v3",
    name: "Elite Luxo",
    type: "luxury",
    pricePerKm: 5.0,
    estimatedArrival: 8,
    capacity: 3,
    image: "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=400",
  },
  {
    id: "v4",
    name: "Elite Carrinha",
    type: "van",
    pricePerKm: 3.5,
    estimatedArrival: 10,
    capacity: 7,
    image: "https://images.unsplash.com/photo-1532939163844-547f958e91b4?auto=format&fit=crop&q=80&w=400",
  },
];

export const LUANDA_MUNICIPALITIES = [
  { id: 'm1', name: 'Luanda', neighborhoods: ['Maianga', 'Ingombota', 'Samba', 'Rangel', 'Sambizanga'] },
  { id: 'm2', name: 'Belas', neighborhoods: ['Kilamba', 'Benfica', 'Talatona'] },
  { id: 'm3', name: 'Cacuaco', neighborhoods: ['Kifangondo', 'Mulenvos'] },
  { id: 'm4', name: 'Cazenga', neighborhoods: ['Hoji-ya-Henda', 'Tala Hady'] },
  { id: 'm5', name: 'Viana', neighborhoods: ['Zango', 'Kikuxi', 'Estalagem'] },
  { id: 'm6', name: 'Kilamba Kiaxi', neighborhoods: ['Golf', 'Palanca'] },
  { id: 'm7', name: 'Talatona', neighborhoods: ['Camama', 'Patriota'] },
];

export const LUANDA_ROADS = [
  'Avenida Deolinda Rodrigues',
  'Via Expressa Fidel Castro',
  'Estrada de Catete',
  'Avenida 21 de Janeiro',
  'Avenida Comandante Gika',
  'Avenida Ho Chi Minh',
];

export const SERVICES: Service[] = [
  {
    id: "s1",
    name: "Viagens",
    description: "Viaje com segurança e conforto por Luanda.",
    icon: "Car",
    type: "ride",
  },
  {
    id: "s2",
    name: "Elite Entregas",
    description: "Entrega rápida e segura para as suas encomendas.",
    icon: "Package",
    type: "delivery",
  },
  {
    id: "s3",
    name: "Elite Lojas",
    description: "Compre nas melhores lojas locais da cidade.",
    icon: "ShoppingBag",
    type: "store",
  },
  {
    id: "s4",
    name: "Elite Prestadores",
    description: "Encontre serviços profissionais para as suas necessidades.",
    icon: "Wrench",
    type: "provider",
  },
];
