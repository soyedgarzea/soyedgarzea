import type {
  EducationItem,
  ExperienceItem,
  HobbyItem,
  Locale,
  NavigationItem,
  ProductItem,
  SocialLink,
} from './site.types';

export const profile = {
  name: 'Edgar Zea',
  location: 'México',
  roles: {
    es: 'Ingeniero de software, psicólogo y fundador de Zinns',
    en: 'Software engineer, psychologist, and Zinns founder',
  },
  intro: {
    es: 'Construyo experiencias web y móviles, mezclando tecnología, curiosidad y una forma muy humana de entender los problemas.',
    en: 'I build web and mobile experiences, blending technology, curiosity, and a deeply human way of understanding problems.',
  },
  bio: {
    es: 'Soy psicólogo, desarrollador y coleccionista de intereses. Estoy casado, comparto mi vida con tres perros y he tenido perros desde siempre. También he enseñado patinaje sobre hielo, trabajado en Recursos Humanos, vendido bebidas y aprendido a rotular autos.',
    en: 'I am a psychologist, developer, and collector of interests. I am married, share my life with three dogs, and have had dogs all my life. I have also taught ice skating, worked in Human Resources, sold drinks, and learned how to wrap cars.',
  },
} as const;

export const navigation: Record<Locale, readonly NavigationItem[]> = {
  es: [
    { label: 'Inicio', href: '/' },
    { label: 'Sobre mí', href: '/#sobre-mi' },
    { label: 'Experiencia', href: '/#experiencia' },
    { label: 'Mis compras', href: '/compras' },
  ],
  en: [
    { label: 'Home', href: '/en' },
    { label: 'About me', href: '/en#about-me' },
    { label: 'Experience', href: '/en#experience' },
    { label: 'Things I bought', href: '/en/items' },
  ],
};

export const socialLinks: readonly SocialLink[] = [
  { label: 'GitHub', href: 'https://github.com/soyedgarzea' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/soyedgarzea' },
  { label: 'Instagram', href: 'https://instagram.com/soyedgarzea' },
  { label: 'TikTok', href: 'https://tiktok.com/@soyedgarzea' },
  { label: 'YouTube', href: 'https://youtube.com/@soyedgarzea' },
  { label: 'X', href: 'https://x.com/soyedgarzea' },
  { label: 'Facebook', href: 'https://facebook.com/soyedgarzea' },
];

export const hobbies: readonly HobbyItem[] = [
  {
    icon: '✦',
    title: { es: 'Pokémon, anime y videojuegos', en: 'Pokémon, anime, and video games' },
    description: {
      es: 'Juego principalmente en Xbox, aunque también he explorado PlayStation, Nintendo Switch, Meta Quest y juegos móviles. Call of Duty: MWII para Xbox 360 sigue entre mis favoritos.',
      en: 'I mainly play on Xbox, but I have also explored PlayStation, Nintendo Switch, Meta Quest, and mobile games. Call of Duty: MWII for Xbox 360 remains one of my favorites.',
    },
  },
  {
    icon: '♫',
    title: { es: 'DJ y música', en: 'DJing and music' },
    description: {
      es: 'Me gusta mezclar música, descubrir sonidos y aprender cómo una selección puede transformar el ambiente.',
      en: 'I enjoy mixing music, discovering sounds, and learning how a selection can transform the atmosphere.',
    },
  },
  {
    icon: '⌘',
    title: { es: 'Desarrollo web y móvil', en: 'Web and mobile development' },
    description: {
      es: 'Crear productos digitales es trabajo y pasatiempo: siempre hay una interfaz, herramienta o idea nueva por explorar.',
      en: 'Building digital products is both work and hobby: there is always a new interface, tool, or idea to explore.',
    },
  },
];

export const education: readonly EducationItem[] = [
  {
    program: { es: 'Programa de Ciencia de Datos', en: 'Data Science Program' },
    institution: 'TripleTen',
  },
  {
    program: { es: 'Desarrollo Web Full Stack — MERN', en: 'Full Stack Web Development — MERN' },
    institution: 'Ironhack',
  },
  {
    program: { es: 'Licenciatura en Psicología', en: 'Bachelor of Psychology' },
    institution: 'UNITEC',
  },
];

export const experience: readonly ExperienceItem[] = [
  {
    role: 'Software Engineer L4',
    company: 'MedTrainer',
    technologies: ['React', 'TypeScript', 'React Query', 'Redux', 'Material UI', 'Jenkins'],
    summary: {
      es: 'Plataforma empresarial de cumplimiento y acreditación para proveedores de salud.',
      en: 'Enterprise healthcare compliance and credentialing platform for healthcare providers.',
    },
    highlights: {
      es: [
        'Implementé un editor colaborativo con control de cambios y Policy Guardian basado en IA.',
        'Construí paginación, ordenamiento y filtros del lado del servidor con estado persistente.',
        'Desarrollé flujos inteligentes de carga, validación y visualización de documentos.',
      ],
      en: [
        'Implemented a collaborative editor with track changes and an AI-powered Policy Guardian.',
        'Built server-side pagination, sorting, and filtering with persistent state.',
        'Developed intelligent document upload, validation, and viewing workflows.',
      ],
    },
  },
  {
    role: 'Full Stack Developer',
    company: 'Cox by Nagarro',
    technologies: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'AWS', 'Jest'],
    summary: {
      es: 'Modernización full stack de una plataforma para concesionarios de autos.',
      en: 'Full-stack modernization of a car dealership platform.',
    },
    highlights: {
      es: [
        'Reconstruí la interfaz con React, TypeScript y Material UI.',
        'Optimicé servicios Express y MongoDB para mejorar tiempos de carga y respuesta.',
        'Fortalecí pruebas, monitoreo y CI/CD con Jest, New Relic, Jenkins y GitHub Actions.',
      ],
      en: [
        'Rebuilt the interface with React, TypeScript, and Material UI.',
        'Optimized Express and MongoDB services to improve load and response times.',
        'Strengthened testing, monitoring, and CI/CD with Jest, New Relic, Jenkins, and GitHub Actions.',
      ],
    },
  },
  {
    role: 'Front End Developer',
    company: 'Revolt',
    technologies: ['React', 'React Native', 'Angular', 'Next.js', 'GraphQL', 'Contentful'],
    summary: {
      es: 'Productos para reclutamiento, educación y comercio electrónico, desde interfaz hasta integración backend.',
      en: 'Recruitment, education, and e-commerce products, from interface work to backend integration.',
    },
    highlights: {
      es: [
        'Construí una plataforma de reclutamiento responsiva con búsqueda, filtros y formularios.',
        'Desarrollé sitios educativos dinámicos e integraciones para administrar contenido.',
        'Creé una app móvil de descubrimiento de moda con recomendaciones personalizadas.',
      ],
      en: [
        'Built a responsive recruitment platform with search, filters, and forms.',
        'Developed dynamic education sites and content-management integrations.',
        'Created a fashion discovery mobile app with personalized recommendations.',
      ],
    },
  },
  {
    role: 'React Developer',
    company: 'AeroMéxico by IDS',
    technologies: ['React'],
    summary: {
      es: 'Mantenimiento y evolución de aplicaciones web en producción.',
      en: 'Maintenance and evolution of production web applications.',
    },
    highlights: {
      es: [
        'Resolví incidentes e implementé funciones basadas en necesidades del negocio.',
        'Refactoricé código legado para mejorar estabilidad y mantenimiento.',
        'Colaboré con diseño y backend en pruebas, correcciones y optimización.',
      ],
      en: [
        'Resolved incidents and delivered features based on business needs.',
        'Refactored legacy code to improve stability and maintainability.',
        'Partnered with design and backend teams on testing, fixes, and optimization.',
      ],
    },
  },
  {
    role: 'Full Stack Jr',
    company: 'APPWIT',
    technologies: ['Angular', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Next.js'],
    summary: {
      es: 'Soluciones web y móviles para pequeños negocios.',
      en: 'Web and mobile solutions for small businesses.',
    },
    highlights: {
      es: [
        'Desarrollé un sitio interno con Next.js y Node.js.',
        'Creé un sitio para una panadería con gestión de contenido y consultas.',
        'Construí plataformas web y móviles para servicios de paseo de perros.',
      ],
      en: [
        'Developed an internal company site with Next.js and Node.js.',
        'Created a bakery website with content and inquiry management.',
        'Built web and mobile platforms for dog-walking services.',
      ],
    },
  },
];

export const products: readonly ProductItem[] = [
  {
    name: 'Teclado de Piano Eléctrico Alesis de 8 Teclas Portátil, 480 Voces',
    marketplace: 'Amazon',
    category: { es: 'Música', en: 'Music' },
    opinion: null,
    imageUrl: null,
    referralUrl: null,
  },
  {
    name: 'Funda para Piano Digital de 99 Teclas, Antipolvo',
    marketplace: 'Mercado Libre',
    category: { es: 'Accesorios musicales', en: 'Music accessories' },
    opinion: null,
    imageUrl: null,
    referralUrl: null,
  },
  {
    name: 'Soporte Ajustable en Altura para Teclado y Piano Electrónico',
    marketplace: 'Mercado Libre',
    category: { es: 'Accesorios musicales', en: 'Music accessories' },
    opinion: null,
    imageUrl: null,
    referralUrl: null,
  },
];
