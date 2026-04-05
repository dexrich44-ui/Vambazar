import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'pt' | 'en';

interface Translations {
  [key: string]: {
    pt: string;
    en: string;
  };
}

const translations: Translations = {
  // Navbar
  eliteUser: { pt: 'Utilizador Elite', en: 'Elite User' },
  
  // Hero
  eliteExperience: { pt: 'Experiência Elite', en: 'Elite Experience' },
  heroTitle: { pt: 'A Sua Forma Inteligente de Viajar e Viver em Luanda', en: 'Your Smart Way to Travel & Live in Luanda' },
  heroSubtitle: { pt: 'Experimente a próxima geração de serviços sob demanda. De viagens premium a entregas expresso, tudo o que precisa está a um toque de distância.', en: 'Experience the next generation of on-demand services. From premium rides to express delivery, everything you need is just a tap away.' },
  searchPlaceholder: { pt: 'Para onde gostaria de ir?', en: 'Where would you like to go?' },
  
  // Services
  ourServices: { pt: 'Nossos Serviços Elite', en: 'Our Elite Services' },
  selectService: { pt: 'Selecione um serviço para começar', en: 'Select a service to get started' },
  viewAll: { pt: 'Ver Todos', en: 'View All' },
  rideName: { pt: 'Viagens', en: 'Ride-Hailing' },
  rideDesc: { pt: 'Viaje com segurança e conforto por Luanda.', en: 'Travel safely and comfortably across Luanda.' },
  deliveryName: { pt: 'Elite Entregas', en: 'Elite Delivery' },
  deliveryDesc: { pt: 'Entrega rápida e segura para as suas encomendas.', en: 'Fast and secure delivery for your packages.' },
  storeName: { pt: 'Elite Lojas', en: 'Elite Stores' },
  storeDesc: { pt: 'Compre nas melhores lojas locais da cidade.', en: 'Shop from the best local stores in the city.' },
  providerName: { pt: 'Elite Prestadores', en: 'Elite Providers' },
  providerDesc: { pt: 'Encontre serviços profissionais para as suas necessidades.', en: 'Find professional services for your needs.' },
  
  // Stats
  totalRides: { pt: 'Total de Viagens', en: 'Total Rides' },
  eliteRating: { pt: 'Avaliação Elite', en: 'Elite Rating' },
  safetyScore: { pt: 'Pontuação de Segurança', en: 'Safety Score' },
  
  // Features
  whyChoose: { pt: 'Porquê Escolher Vambazar Elite?', en: 'Why Choose Vambazar Elite?' },
  whyChooseDesc: { pt: 'Redesenhamos a experiência sob demanda do zero para fornecer qualidade, segurança e conveniência incomparáveis para o povo de Luanda.', en: "We've redesigned the on-demand experience from the ground up to provide unmatched quality, safety, and convenience for the people of Luanda." },
  featFastTitle: { pt: 'Resposta Ultra-Rápida', en: 'Ultra-Fast Response' },
  featFastDesc: { pt: 'Tempo médio de recolha inferior a 5 minutos.', en: 'Average pickup time of under 5 minutes.' },
  featSafetyTitle: { pt: 'Protocolo de Segurança Elite', en: 'Elite Safety Protocol' },
  featSafetyDesc: { pt: 'Cada viagem e entrega é monitorizada 24/7.', en: 'Every ride and delivery is monitored 24/7.' },
  featFleetTitle: { pt: 'Frota Premium', en: 'Premium Fleet' },
  featFleetDesc: { pt: 'Apenas os veículos e motoristas com melhor classificação.', en: 'Only the highest-rated vehicles and drivers.' },
  
  // Booking Form
  bookRide: { pt: 'Reserve a Sua Viagem', en: 'Book Your Ride' },
  cancel: { pt: 'Cancelar', en: 'Cancel' },
  stepRoute: { pt: 'Rota', en: 'Route' },
  stepVehicle: { pt: 'Veículo', en: 'Vehicle' },
  stepConfirm: { pt: 'Confirmar', en: 'Confirm' },
  pickupLocation: { pt: 'Local de Recolha', en: 'Pickup Location' },
  dropoffLocation: { pt: 'Local de Destino', en: 'Drop-off Location' },
  date: { pt: 'Data', en: 'Date' },
  time: { pt: 'Hora', en: 'Time' },
  today: { pt: 'Hoje, 4 Abr', en: 'Today, Apr 4' },
  now: { pt: 'Agora', en: 'Now' },
  chooseVehicle: { pt: 'Escolha o Seu Veículo Elite', en: 'Choose Your Elite Vehicle' },
  bookingSummary: { pt: 'Resumo da Reserva', en: 'Booking Summary' },
  rideConfirmation: { pt: 'Confirmação de Viagem Elite', en: 'Elite Ride Confirmation' },
  from: { pt: 'De', en: 'From' },
  to: { pt: 'Para', en: 'To' },
  currentLocation: { pt: 'Localização Atual', en: 'Current Location' },
  selectDestination: { pt: 'Selecionar Destino', en: 'Select Destination' },
  estimatedFare: { pt: 'Tarifa Estimada', en: 'Estimated Fare' },
  vehicle: { pt: 'Veículo', en: 'Vehicle' },
  back: { pt: 'Voltar', en: 'Back' },
  continue: { pt: 'Continuar', en: 'Continue' },
  confirmBooking: { pt: 'Confirmar Reserva', en: 'Confirm Booking' },
  bookingConfirmed: { pt: 'Reserva Confirmada!', en: 'Booking Confirmed!' },
  driverOnWay: { pt: 'O seu motorista Elite está a caminho. Chegada estimada: 6 minutos.', en: 'Your Elite driver is on the way. Estimated arrival: 6 minutes.' },
  trackRide: { pt: 'Rastrear Viagem', en: 'Track My Ride' },
  
  // Delivery Form
  setupDelivery: { pt: 'Configurar Entrega Elite', en: 'Setup Elite Delivery' },
  stepPackage: { pt: 'Pacote', en: 'Package' },
  stepReceiver: { pt: 'Recetor', en: 'Receiver' },
  pickupOrigin: { pt: 'Local de Recolha (Origem)', en: 'Pickup Location (Origin)' },
  deliveryDestination: { pt: 'Local de Entrega (Destino)', en: 'Delivery Location (Destination)' },
  packageType: { pt: 'Tipo de Encomenda', en: 'Package Type' },
  receiverInfo: { pt: 'Informação do Recetor', en: 'Receiver Information' },
  receiverName: { pt: 'Nome do Recetor', en: 'Receiver Name' },
  receiverPhone: { pt: 'Telemóvel do Recetor', en: 'Receiver Phone' },
  deliverySummary: { pt: 'Resumo da Entrega', en: 'Delivery Summary' },
  deliveryConfirmation: { pt: 'Confirmação de Envio Elite', en: 'Elite Delivery Confirmation' },
  deliveryCost: { pt: 'Custo de Envio', en: 'Delivery Cost' },
  estimatedTime: { pt: 'Tempo Estimado', en: 'Estimated Time' },
  confirmDelivery: { pt: 'Confirmar Envio', en: 'Confirm Delivery' },
  deliveryStarted: { pt: 'Envio Iniciado!', en: 'Delivery Started!' },
  courierPickingUp: { pt: 'O estafeta Elite está a recolher a sua encomenda. Entrega estimada em 30 minutos.', en: 'The Elite courier is picking up your package. Estimated delivery in 30 minutes.' },
  trackPackage: { pt: 'Rastrear Encomenda', en: 'Track Package' },
  
  // Package Types
  pkgSmall: { pt: 'Pequeno', en: 'Small' },
  pkgMedium: { pt: 'Médio', en: 'Medium' },
  pkgLarge: { pt: 'Grande', en: 'Large' },
  pkgFragile: { pt: 'Frágil', en: 'Fragile' },
  
  // Map
  realTimeTraffic: { pt: 'Trânsito em Tempo Real', en: 'Real-Time Traffic' },
  lowCongestion: { pt: 'Baixa Congestão', en: 'Low Congestion' },
  estimatedTimeMap: { pt: 'Tempo Estimado', en: 'Estimated Time' },
  min: { pt: 'MIN', en: 'MIN' },
  
  // AI Assistant
  aiWelcome: { pt: 'Olá! Sou o seu Assistente de IA do Vambazar Elite. Como posso ajudá-lo a viajar de forma mais inteligente hoje?', en: 'Hello! I am your Vambazar Elite AI Assistant. How can I help you travel smarter today?' },
  aiAssistant: { pt: 'Assistente Elite', en: 'Elite Assistant' },
  aiPlaceholder: { pt: 'Peça conselhos de viagem...', en: 'Ask for travel advice...' },
  aiError: { pt: 'Lamento, não consegui processar esse pedido.', en: "I'm sorry, I couldn't process that request." },
  online: { pt: 'Online', en: 'Online' },
  
  // Vehicle Types
  economyName: { pt: 'Elite Económico', en: 'Elite Economy' },
  premiumName: { pt: 'Elite Premium', en: 'Elite Premium' },
  luxuryName: { pt: 'Elite Luxo', en: 'Elite Luxury' },
  vanName: { pt: 'Elite Carrinha', en: 'Elite Van' },
  
  // Driver Chat
  eliteDriver: { pt: 'Motorista Elite', en: 'Elite Driver' },
  driverInitialMessage: { pt: 'Olá! Sou o seu motorista Elite. Já estou a caminho do seu local de recolha.', en: "Hello! I'm your Elite driver. I'm already on my way to your pickup location." },
  driverResponse1: { pt: 'Com certeza, estarei aí em breve.', en: "Certainly, I'll be there soon." },
  driverResponse2: { pt: 'Entendido. Estou a seguir o GPS.', en: "Understood. I'm following the GPS." },
  driverResponse3: { pt: 'Obrigado pela informação. Até já!', en: "Thanks for the info. See you soon!" },
  driverResponse4: { pt: 'Estou quase a chegar ao ponto de encontro.', en: "I'm almost at the meeting point." },
  chatPlaceholder: { pt: 'Escreva uma mensagem...', en: 'Write a message...' },
  chatWithDriver: { pt: 'Conversar com o Motorista', en: 'Chat with Driver' },
  origin: { pt: 'Origem', en: 'Origin' },
  destination: { pt: 'Destino', en: 'Destination' },
  dragToSetLocation: { pt: 'Arraste os marcadores para definir a localização', en: 'Drag markers to set location' },
  
  // Delivery Page
  deliveryHeroTitle: { pt: 'Entrega Elite à sua Porta', en: 'Elite Delivery at Your Doorstep' },
  deliveryHeroSubtitle: { pt: 'Envie encomendas pela cidade com rastreio em tempo real e estafetas profissionais.', en: 'Send packages across the city with real-time tracking and professional couriers.' },
  fastDelivery: { pt: 'Entrega Rápida', en: 'Fast Delivery' },
  liveTracking: { pt: 'Rastreio em Tempo Real', en: 'Live Tracking' },
  avgTime: { pt: 'Tempo Médio', en: 'Avg. Time' },
  insured: { pt: 'Seguro', en: 'Insured' },

  // Stores Page
  storesHeroTitle: { pt: 'Compre o Melhor da Cidade', en: 'Shop the Best of the City' },
  storesHeroSubtitle: { pt: 'De comida gourmet a moda de luxo, tudo o que ama entregue à sua porta.', en: 'From gourmet food to high-end fashion, everything you love delivered to your door.' },
  premiumStores: { pt: 'Lojas Premium', en: 'Premium Stores' },
  searchStores: { pt: 'Procurar lojas ou artigos...', en: 'Search for stores or items...' },
  featuredStores: { pt: 'Lojas em Destaque', en: 'Featured Stores' },

  // Services Page
  servicesHeroTitle: { pt: 'Ajuda Profissional para Cada Necessidade', en: 'Professional Help for Every Need' },
  servicesHeroSubtitle: { pt: 'Reserve profissionais verificados para casa, tecnologia, saúde e muito mais.', en: 'Book verified professionals for home, tech, health, and more. Quality guaranteed.' },
  eliteServices: { pt: 'Serviços Elite', en: 'Elite Services' },
  searchServices: { pt: 'Procurar serviços...', en: 'Search for services...' },
  featuredServices: { pt: 'Serviços em Destaque', en: 'Featured Services' },

  // Bottom Nav
  navHome: { pt: 'Início', en: 'Home' },
  navRides: { pt: 'Viagens', en: 'Rides' },
  navDelivery: { pt: 'Entregas', en: 'Delivery' },
  navStores: { pt: 'Lojas', en: 'Stores' },
  navServices: { pt: 'Serviços', en: 'Services' },

  // Luanda Specific
  luandaMap: { pt: 'Mapa de Luanda', en: 'Luanda Map' },
  municipalities: { pt: 'Municípios', en: 'Municipalities' },
  neighborhoods: { pt: 'Bairros', en: 'Neighborhoods' },
  roads: { pt: 'Estradas', en: 'Roads' },
  quickAiLocation: { pt: 'Localização Rápida IA', en: 'Quick AI Location' },
  errorRequired: { pt: 'Este campo é obrigatório', en: 'This field is required' },
  errorMinLength: { pt: 'O endereço deve ter pelo menos 5 caracteres', en: 'Address must be at least 5 characters' },
  welcomeElite: { pt: 'Bem-vindo ao Elite', en: 'Welcome to Elite' },
  loginToContinue: { pt: 'Inicie sessão para continuar a sua experiência premium.', en: 'Log in to continue your premium experience.' },
  iamClient: { pt: 'Sou um Cliente', en: 'I am a Client' },
  bookRidesDeliveries: { pt: 'Reserve viagens e entregas', en: 'Book rides and deliveries' },
  iamDriver: { pt: 'Sou um Motorista', en: 'I am a Driver' },
  earnWithElite: { pt: 'Ganhe dinheiro com a Elite', en: 'Earn money with Elite' },
  termsAgreement: { pt: 'Ao entrar, concorda com os nossos Termos de Serviço e Política de Privacidade.', en: 'By signing in, you agree to our Terms of Service and Privacy Policy.' },
  loginRequired: { pt: 'Login Necessário', en: 'Login Required' },
  logout: { pt: 'Sair', en: 'Logout' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('pt');

  const t = (key: string) => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
