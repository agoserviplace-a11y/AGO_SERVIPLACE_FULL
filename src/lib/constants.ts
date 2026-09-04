import { Category, PlatformSettings } from '../types';

export const PLATFORM_SETTINGS: PlatformSettings = {
  commissionPercentage: 10, // 10%
  minimumCommission: 2, // $2 min
  currency: 'USD'
};

export const ECUADOR_PROVINCES = [
  {
    name: 'Pichincha',
    cities: ['Quito', 'Rumiñahui', 'Cayambe', 'Mejía', 'Machachi']
  },
  {
    name: 'Guayas',
    cities: ['Guayaquil', 'Samborondón', 'Daule', 'Durán', 'Milagro', 'Playas']
  },
  {
    name: 'Azuay',
    cities: ['Cuenca', 'Gualaceo', 'Paute', 'Santa Isabel']
  },
  {
    name: 'Manabí',
    cities: ['Manta', 'Portoviejo', 'Chone', 'Montecristi', 'Bahía de Caráquez']
  },
  {
    name: 'Tungurahua',
    cities: ['Ambato', 'Baños de Agua Santa', 'Pelileo']
  },
  {
    name: 'El Oro',
    cities: ['Machala', 'Pasaje', 'Santa Rosa', 'Huaquillas']
  },
  {
    name: 'Loja',
    cities: ['Loja', 'Catamayo', 'Vilcabamba']
  },
  {
    name: 'Imbabura',
    cities: ['Ibarra', 'Otavalo', 'Cotacachi']
  },
  {
    name: 'Chimborazo',
    cities: ['Riobamba', 'Guano', 'Alausí']
  },
  {
    name: 'Santo Domingo',
    cities: ['Santo Domingo']
  },
  {
    name: 'Santa Elena',
    cities: ['Salinas', 'La Libertad', 'Santa Elena', 'Montañita']
  },
  {
    name: 'Cotopaxi',
    cities: ['Latacunga', 'Salcedo', 'Pujilí']
  }
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'tecnologia',
    name: 'Tecnología y Software',
    slug: 'tecnologia',
    description: 'Desarrollo web, aplicaciones móviles, soporte de TI y automatización digital.',
    icon: 'Laptop',
    order: 1,
    active: true,
    subcategories: [
      { id: 'web', name: 'Desarrollo Web & Frontend', slug: 'desarrollo-web' },
      { id: 'mobile', name: 'Desarrollo Móvil (iOS & Android)', slug: 'desarrollo-movil' },
      { id: 'soporte', name: 'Soporte Técnico & Redes', slug: 'soporte-tecnico' },
      { id: 'devops', name: 'Bases de Datos & Servidores Cloud', slug: 'bases-de-datos' },
      { id: 'ia', name: 'Automatización & Chatbots', slug: 'automatizacion' }
    ]
  },
  {
    id: 'diseno',
    name: 'Diseño y Multimedia',
    slug: 'diseno',
    description: 'Identidad visual, diseño UI/UX, producción de video y fotografía publicitaria.',
    icon: 'Palette',
    order: 2,
    active: true,
    subcategories: [
      { id: 'branding', name: 'Branding & Identidad Corporativa', slug: 'branding' },
      { id: 'ui-ux', name: 'Diseño UI/UX para Apps y Web', slug: 'ui-ux' },
      { id: 'video', name: 'Edición de Video & Animación', slug: 'edicion-video' },
      { id: 'fotografia', name: 'Fotografía de Productos & Eventos', slug: 'fotografia' },
      { id: 'redes', name: 'Diseño de Piezas para Redes', slug: 'piezas-redes' }
    ]
  },
  {
    id: 'hogar',
    name: 'Hogar y Mantenimiento',
    slug: 'hogar',
    description: 'Servicios técnicos presenciales para residencias, oficinas y locales comerciales.',
    icon: 'Wrench',
    order: 3,
    active: true,
    subcategories: [
      { id: 'electricidad', name: 'Electricidad e Instalaciones', slug: 'electricidad' },
      { id: 'plomeria', name: 'Plomería & Tuberías', slug: 'plomeria' },
      { id: 'climatizacion', name: 'Aire Acondicionado & Refrigeración', slug: 'climatizacion' },
      { id: 'reparaciones', name: 'Cerrajería & Reparaciones Generales', slug: 'cerrajeria' },
      { id: 'pintura', name: 'Pintura & Acabados Interiores', slug: 'pintura' }
    ]
  },
  {
    id: 'negocios',
    name: 'Negocios y Legal',
    slug: 'negocios',
    description: 'Contabilidad tributaria SRI, asesoría legal, auditoría y consultoría estratégica.',
    icon: 'Briefcase',
    order: 4,
    active: true,
    subcategories: [
      { id: 'sri-contabilidad', name: 'Contabilidad & Declaraciones SRI', slug: 'contabilidad-sri' },
      { id: 'asesoria-legal', name: 'Asesoría Legal & Contratos', slug: 'asesoria-legal' },
      { id: 'marketing-digital', name: 'Estrategia de Ventas & Pauta Digital', slug: 'marketing-digital' },
      { id: 'consultoria', name: 'Gestión de Procesos & Finanzas', slug: 'consultoria-finanzas' }
    ]
  },
  {
    id: 'educacion',
    name: 'Educación y Capacitación',
    slug: 'educacion',
    description: 'Tutorías académicas, idiomas, música y capacitación profesional especializada.',
    icon: 'GraduationCap',
    order: 5,
    active: true,
    subcategories: [
      { id: 'ingles', name: 'Clases de Inglés & Francés', slug: 'idiomas' },
      { id: 'tutorias-univ', name: 'Tutorías Matemáticas & Ciencias', slug: 'tutorias' },
      { id: 'musica', name: 'Música & Producción Sonora', slug: 'musica' },
      { id: 'capacitacion-empresas', name: 'Capacitación a Equipos de Trabajo', slug: 'capacitacion-equipos' }
    ]
  },
  {
    id: 'bienestar',
    name: 'Salud y Bienestar',
    slug: 'bienestar',
    description: 'Entrenamiento personalizado, fisioterapia, nutrición y cuidado integral.',
    icon: 'Activity',
    order: 6,
    active: true,
    subcategories: [
      { id: 'entrenador', name: 'Entrenador Personal & Fitness', slug: 'fitness' },
      { id: 'nutricion', name: 'Nutrición Clínica & Deportiva', slug: 'nutricion' },
      { id: 'fisioterapia', name: 'Fisioterapia & Masajes Terapéuticos', slug: 'fisioterapia' }
    ]
  }
];

export const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  // Service requests
  draft: { bg: 'bg-slate-100', text: 'text-slate-700', label: 'Borrador' },
  published: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Publicada' },
  receivingOffers: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Recibiendo Propuestas' },
  inNegotiation: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'En Negociación' },
  contracted: { bg: 'bg-indigo-50', text: 'text-indigo-700', label: 'Contratado' },
  completed: { bg: 'bg-green-50', text: 'text-green-700', label: 'Completado' },
  cancelled: { bg: 'bg-rose-50', text: 'text-rose-700', label: 'Cancelado' },
  expired: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Expirado' },

  // Proposals
  pending: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Pendiente' },
  viewed: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Vista' },
  shortlisted: { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Preseleccionada' },
  accepted: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Aceptada' },
  rejected: { bg: 'bg-rose-50', text: 'text-rose-700', label: 'No seleccionada' },
  withdrawn: { bg: 'bg-slate-100', text: 'text-slate-600', label: 'Retirada' },

  // Jobs
  pendingPayment: { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Pendiente de Fondos' },
  funded: { bg: 'bg-blue-50', text: 'text-blue-700', label: 'Fondos Asignados' },
  inProgress: { bg: 'bg-sky-50', text: 'text-sky-700', label: 'En Ejecución' },
  submitted: { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Entregado para Revisión' },
  revision: { bg: 'bg-orange-50', text: 'text-orange-700', label: 'En Corrección' },
  disputed: { bg: 'bg-red-50', text: 'text-red-700', label: 'En Disputa' },
  refunded: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Reembolsado' }
};
