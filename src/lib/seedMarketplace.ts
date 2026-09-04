import { collection, getDocs, doc, setDoc, limit, query } from 'firebase/firestore';
import { db } from './firebase';
import { Service, SpecialistProfile, ServiceRequest } from '../types';

export const INITIAL_SPECIALISTS: SpecialistProfile[] = [
  {
    userId: 'spec_carlos_mendoza',
    professionalName: 'Ing. Carlos Mendoza',
    headline: 'Desarrollador Full-Stack Cloud & Aplicaciones Móviles',
    description: 'Ingeniero de Sistemas con más de 7 años de experiencia construyendo plataformas web con React, Next.js, Node.js y arquitecturas cloud en AWS y Firebase. Experiencia previa con startups fintech en Quito y clientes internacionales.',
    categories: ['tecnologia'],
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Firebase', 'PostgreSQL', 'Flutter'],
    experienceYears: 7,
    location: 'Quito, Pichincha',
    province: 'Pichincha',
    city: 'Quito',
    serviceArea: 'Nacional / Remoto',
    remoteAvailable: true,
    hourlyRate: 35,
    responseTime: 'Menos de 1 hora',
    completedJobs: 48,
    ratingAverage: 4.9,
    ratingCount: 37,
    verificationStatus: 'verified',
    profileStatus: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    userId: 'spec_valeria_alava',
    professionalName: 'Valeria Álava',
    headline: 'Diseñadora UI/UX Senior & Especialista en Branding Digital',
    description: 'Especialista en experiencia de usuario y diseño de interfaces minimalistas para productos digitales de alta conversión. He colaborado con agencias de publicidad en Guayaquil y proyectos de e-commerce.',
    categories: ['diseno'],
    skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Branding', 'Prototipado', 'Adobe Illustrator'],
    experienceYears: 6,
    location: 'Guayaquil, Guayas',
    province: 'Guayas',
    city: 'Guayaquil',
    serviceArea: 'Remoto y Presencial en Samborondón / Guayaquil',
    remoteAvailable: true,
    hourlyRate: 30,
    responseTime: 'Menos de 2 horas',
    completedJobs: 62,
    ratingAverage: 5.0,
    ratingCount: 54,
    verificationStatus: 'verified',
    profileStatus: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    userId: 'spec_marco_recalde',
    professionalName: 'Marco Recalde',
    headline: 'Técnico Eléctrico Certificado & Domótica Residencial',
    description: 'Técnico electricista certificado con 10 años de trayectoria en instalaciones eléctricas de media y baja tensión, cableado estructurado, tableros de breakers e iluminación inteligente en Cuenca y Azuay.',
    categories: ['hogar'],
    skills: ['Instalaciones Eléctricas', 'Tableros Eléctricos', 'Domótica', 'Iluminación LED', 'Seguridad Eléctrica'],
    experienceYears: 10,
    location: 'Cuenca, Azuay',
    province: 'Azuay',
    city: 'Cuenca',
    serviceArea: 'Cuenca, Gualaceo y alrededores',
    remoteAvailable: false,
    hourlyRate: 25,
    responseTime: 'Menos de 30 minutos',
    completedJobs: 115,
    ratingAverage: 4.8,
    ratingCount: 89,
    verificationStatus: 'verified',
    profileStatus: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    userId: 'spec_estefania_paz',
    professionalName: 'CPA Estefanía Paz',
    headline: 'Contadora Pública Autorizada & Asesora Tributaria SRI',
    description: 'Contadora Pública con especialización tributaria. Asesoría integral para personas naturales, RIMPE, sociedades y empresas. Declaraciones de IVA, Impuesto a la Renta, anexos transaccionales y auditorías.',
    categories: ['negocios'],
    skills: ['Declaraciones SRI', 'RIMPE Emprendedor', 'Impuesto a la Renta', 'Contabilidad General', 'NIIF'],
    experienceYears: 8,
    location: 'Quito, Pichincha',
    province: 'Pichincha',
    city: 'Quito',
    serviceArea: 'Nacional (Digital / Online)',
    remoteAvailable: true,
    hourlyRate: 28,
    responseTime: 'Menos de 1 hora',
    completedJobs: 92,
    ratingAverage: 4.9,
    ratingCount: 76,
    verificationStatus: 'verified',
    profileStatus: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv_web_landing',
    specialistId: 'spec_carlos_mendoza',
    specialistName: 'Ing. Carlos Mendoza',
    specialistRating: 4.9,
    specialistJobs: 48,
    title: 'Desarrollo de Sitio Web Corporativo o Landing Page de Alta Velocidad',
    slug: 'sitio-web-corporativo-landing-page',
    description: 'Construcción completa de sitio web profesional optimizado para SEO, diseño responsivo para smartphones y tablets, integración con WhatsApp comercial y panel de administración.',
    categoryId: 'tecnologia',
    subcategoryId: 'web',
    categoryName: 'Tecnología y Software',
    images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'],
    pricingType: 'from',
    basePrice: 280,
    priceFrom: 280,
    estimatedDuration: '7 a 10 días',
    deliveryDays: 7,
    locationType: 'remote',
    location: 'Quito / Remoto a nivel nacional',
    requirements: 'Logo de la empresa, contenidos o textos base, y paleta de colores preferida.',
    tags: ['Web', 'Next.js', 'SEO', 'Responsive', 'Landing'],
    status: 'active',
    views: 312,
    favorites: 45,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'srv_ui_figma',
    specialistId: 'spec_valeria_alava',
    specialistName: 'Valeria Álava',
    specialistRating: 5.0,
    specialistJobs: 62,
    title: 'Diseño de Interfaz UI/UX en Figma para Aplicación Móvil o SaaS',
    slug: 'diseno-interfaz-ui-ux-figma',
    description: 'Investigación de usuarios, wireframing, diseño de sistema de diseño (tokens, tipografía, componentes reutilizables) y prototipo interactivo listo para desarrollo en Figma.',
    categoryId: 'diseno',
    subcategoryId: 'ui-ux',
    categoryName: 'Diseño y Multimedia',
    images: ['https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80'],
    pricingType: 'from',
    basePrice: 350,
    priceFrom: 350,
    estimatedDuration: '10 días',
    deliveryDays: 10,
    locationType: 'remote',
    location: 'Guayaquil / Remoto',
    requirements: 'Breve descripción del modelo de negocio, usuarios objetivo y funciones requeridas.',
    tags: ['Figma', 'UI Design', 'UX Research', 'Mobile App', 'Prototipo'],
    status: 'active',
    views: 245,
    favorites: 38,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'srv_electricidad_hogar',
    specialistId: 'spec_marco_recalde',
    specialistName: 'Marco Recalde',
    specialistRating: 4.8,
    specialistJobs: 115,
    title: 'Diagnóstico e Instalación Eléctrica Integral Residencial y Comercial',
    slug: 'diagnostico-instalacion-electrica-cuenca',
    description: 'Revisión técnica de sobrecargas, reemplazo de cableado deteriorado, instalación de paneles eléctricos de breakers, iluminación LED empotrada y enchufes polarizados con garantía escrita.',
    categoryId: 'hogar',
    subcategoryId: 'electricidad',
    categoryName: 'Hogar y Mantenimiento',
    images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80'],
    pricingType: 'fixed',
    basePrice: 65,
    priceFrom: 65,
    estimatedDuration: '1 día',
    deliveryDays: 1,
    locationType: 'onsite',
    location: 'Cuenca, Azuay',
    requirements: 'Acceso seguro a tablero principal e indicación de los puntos a intervenir.',
    tags: ['Electricidad', 'Mantenimiento', 'Cuenca', 'Seguridad', 'Hogar'],
    status: 'active',
    views: 410,
    favorites: 52,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'srv_sri_declaracion',
    specialistId: 'spec_estefania_paz',
    specialistName: 'CPA Estefanía Paz',
    specialistRating: 4.9,
    specialistJobs: 92,
    title: 'Declaración Mensual / Semestral SRI & Asesoría Tributaria RIMPE',
    slug: 'declaracion-sri-asesoria-tributaria',
    description: 'Elaboración de declaraciones de IVA e Impuesto a la Renta en portal SRI en línea. Conciliación de facturación electrónica, cálculo de retenciones y optimización de gastos deducibles.',
    categoryId: 'negocios',
    subcategoryId: 'sri-contabilidad',
    categoryName: 'Negocios y Legal',
    images: ['https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop&q=80'],
    pricingType: 'fixed',
    basePrice: 40,
    priceFrom: 40,
    estimatedDuration: '1 a 2 días',
    deliveryDays: 2,
    locationType: 'remote',
    location: 'Quito / Todo el Ecuador (100% Online)',
    requirements: 'Clave de acceso al SRI en línea y reporte o facturas electrónicas del período.',
    tags: ['SRI', 'Contabilidad', 'Impuestos', 'RIMPE', 'Facturación'],
    status: 'active',
    views: 520,
    favorites: 68,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const INITIAL_REQUESTS: ServiceRequest[] = [
  {
    id: 'req_ecommerce_boutique',
    requesterId: 'usr_patricia_c',
    requesterName: 'Patricia Celleri',
    title: 'Creación de tienda virtual e-commerce con pasarela de pagos para tienda de ropa',
    description: 'Necesitamos desarrollar una tienda en línea para nuestra boutique en Cumbayá. Se requiere catálogo de hasta 100 productos, integración con pasarela de pago local (Payphone o Kushki) y cálculo de envíos Servientrega.',
    categoryId: 'tecnologia',
    subcategoryId: 'web',
    categoryName: 'Tecnología y Software',
    budgetMin: 400,
    budgetMax: 750,
    location: 'Quito (Cumbayá) / Remoto',
    remote: true,
    deadline: '15 de Octubre 2026',
    proposalsCount: 3,
    status: 'receivingOffers',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'req_remodelacion_electrica',
    requesterId: 'usr_rodrigo_m',
    requesterName: 'Rodrigo Morales',
    title: 'Reemplazo total de cableado y breakers para casa de 2 pisos en Samborondón',
    description: 'Requerimos un Especialista eléctrico con experiencia comprobada para inspeccionar el sistema eléctrico antiguo de una casa, independizar circuitos de aires acondicionados y colocar tablero general nuevo.',
    categoryId: 'hogar',
    subcategoryId: 'electricidad',
    categoryName: 'Hogar y Mantenimiento',
    budgetMin: 180,
    budgetMax: 300,
    location: 'Samborondón, Guayas',
    remote: false,
    deadline: 'Urgente (Fin de semana)',
    proposalsCount: 2,
    status: 'receivingOffers',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export async function seedInitialMarketplaceIfNeeded() {
  try {
    const servicesSnap = await getDocs(query(collection(db, 'services'), limit(1)));
    if (servicesSnap.empty) {
      console.log('Seeding initial marketplace data into Firestore...');
      // 1. Specialists
      for (const spec of INITIAL_SPECIALISTS) {
        await setDoc(doc(db, 'specialistProfiles', spec.userId), spec);
      }
      // 2. Services
      for (const srv of INITIAL_SERVICES) {
        await setDoc(doc(db, 'services', srv.id), srv);
      }
      // 3. Requests
      for (const req of INITIAL_REQUESTS) {
        await setDoc(doc(db, 'serviceRequests', req.id), req);
      }
      console.log('Seeding completed successfully in Firestore.');
    }
  } catch (err) {
    console.warn('Seed operation skipped or caught:', err);
  }
}
