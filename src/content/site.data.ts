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
    name: 'Teclado de Piano Eléctrico Alesis de 88 Teclas Portátil, 480 Voces',
    marketplace: 'Mercado Libre',
    category: { es: 'Música', en: 'Music' },
    iconUrl: '/items/electric-piano.svg',
    opinion: {
      es: 'Es una muy buena opción para quienes quieren comenzar a aprender piano sin invertir de inmediato en un equipo profesional. Cuenta con 480 sonidos, control de volumen y conexión MIDI para utilizarlo con aplicaciones y programas musicales. Incluye cargador, también funciona con baterías y ofrece una prueba gratuita de clases en línea. En general, es un teclado versátil, completo y amigable para principiantes.',
      en: 'It is a very good option for anyone who wants to start learning piano without immediately investing in professional equipment. It has 480 sounds, volume control, and MIDI connectivity for use with music apps and software. It includes a charger, can also run on batteries, and offers a free trial of online lessons. Overall, it is a versatile, complete, and beginner-friendly keyboard.',
    },
    referralUrl: 'https://meli.la/1SnLzpf',
    reviewUrl:
      'https://www.instagram.com/reel/Dbq8LVHyTV5/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
  {
    name: 'Funda para Piano Digital de 99 Teclas, Antipolvo',
    marketplace: 'Mercado Libre',
    category: { es: 'Accesorios musicales', en: 'Music accessories' },
    iconUrl: '/items/piano-cover.svg',
    opinion: null,
    referralUrl: 'https://meli.la/1WcL1kT',
    reviewUrl: null,
  },
  {
    name: 'Soporte Ajustable en Altura para Teclado y Piano Electrónico',
    marketplace: 'Mercado Libre',
    category: { es: 'Accesorios musicales', en: 'Music accessories' },
    iconUrl: '/items/keyboard-stand.svg',
    opinion: null,
    referralUrl: 'https://meli.la/1s52tDi',
    reviewUrl: null,
  },
  {
    name: 'Roborock Qrevo S',
    marketplace: 'Mercado Libre',
    category: { es: 'Hogar inteligente', en: 'Smart home' },
    iconUrl: '/items/robot-vacuum.svg',
    opinion: {
      es: 'Es una excelente opción para mantener el hogar limpio con menos esfuerzo. Aspira y trapea de forma eficiente, aunque requiere mantenimiento regular para conservar un buen rendimiento. En hogares con mascotas o acumulación de polvo puede necesitar más de una pasada. Para trapear, la marca recomienda su líquido especial, aunque también funciona únicamente con agua. En general, es un equipo práctico y completo para la limpieza diaria, siempre que se mantengan limpios sus cepillos, depósitos y mopas.',
      en: 'It is an excellent option for keeping a home clean with less effort. It vacuums and mops efficiently, although it needs regular maintenance to keep performing well. Homes with pets or significant dust buildup may require more than one pass. The brand recommends its special cleaning solution for mopping, although it can also work with water only. Overall, it is a practical and complete device for daily cleaning as long as its brushes, tanks, and mop pads are kept clean.',
    },
    referralUrl: 'https://meli.la/2rGeDqy',
    reviewUrl:
      'https://www.instagram.com/reel/DLoBRDNRQF8/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
  },
  {
    name: 'Caminadora Portátil',
    marketplace: 'Mercado Libre',
    category: { es: 'Ejercicio', en: 'Fitness' },
    iconUrl: '/items/walking-pad.svg',
    opinion: {
      es: 'Si buscas una opción para mantenerte activo mientras trabajas desde casa, esta caminadora ofrece una muy buena relación calidad-precio. Está diseñada para caminatas y actividad ligera, no para entrenamientos intensos ni correr a altas velocidades. Su velocidad es suficiente para mantenerse en movimiento durante la jornada laboral y sus ruedas facilitan moverla. Aunque es más compacta que una caminadora tradicional, todavía necesita un espacio considerable para guardarla. En general, es una excelente alternativa para incorporar más actividad física a la rutina diaria sin ocupar tanto espacio como un equipo convencional.',
      en: 'If you want to stay active while working from home, this walking pad offers very good value for money. It is designed for walking and light activity, not intense training or high-speed running. Its speed is enough to keep moving during the workday, and its wheels make it easier to relocate. Although more compact than a traditional treadmill, it still needs considerable storage space. Overall, it is an excellent way to add more physical activity to a daily routine without taking up as much room as conventional equipment.',
    },
    referralUrl: 'https://meli.la/1V5ys3A',
    reviewUrl: null,
  },
];
