// src/content/menu.ts
// Centralized menu config for all languages


export interface MenuItem {
  label: string;
  href: string;
  title?: string;
  description?: string;
  children?: MenuItem[];
}

// Use Astro's getCollection for dynamic SERVICES menu
export async function getServiceMenu(lang: string) {
  const { getCollection } = await import('astro:content');
  const allServices = await getCollection('services');
  return allServices
    .filter(s => s.data.lang === lang)
    .sort((a, b) => (a.data.order ?? 999) - (b.data.order ?? 999))
    .map(s => ({
      href: `/${lang}/service/${s.data.slug}`,
      title: s.data.title,
      description: s.data.description || '',
      label: s.data.title,
      order: s.data.order
    }));
}

// Menu cấu hình cho từng ngôn ngữ
export const menus: Record<string, MenuItem[]> = {
  en: [
    { label: 'HOME', href: '/', title: 'Home' },
    { label: 'SERVICES', href: '/#services', title: 'Services' },
    { label: 'ABOUT US', href: '/about-us', title: 'About Us' },
    { label: 'TRAINING', href: '/training', title: 'Training' },
    { label: 'SOLUTIONS', href: '/solutions', title: 'Solutions' },
    { label: 'COMMUNICATION', href: '/communication', title: 'Communication' },
    { label: 'CONTACT', href: '/#contact', title: 'Contact' }
  ],
  vi: [
    { label: 'TRANG CHỦ', href: '/vi/', title: 'Trang chủ' },
    { label: 'DỊCH VỤ', href: '/vi/#services', title: 'Dịch vụ' },
    { label: 'GIỚI THIỆU', href: '/vi/about-us', title: 'Giới thiệu' },
    { label: 'ĐÀO TẠO', href: '/vi/training', title: 'Đào tạo' },
    { label: 'GIẢI PHÁP', href: '/vi/solutions', title: 'Giải pháp' },
    { label: 'TRUYỀN THÔNG', href: '/vi/communication', title: 'Truyền thông' },
    { label: 'LIÊN HỆ', href: '/vi/#contact', title: 'Liên hệ' }
  ],
  ja: [
    { label: 'ホーム', href: '/ja/', title: 'ホーム' },
    {
      label: 'SOBRE NOSOTROS', href: '/ja/about-us', title: 'Sobre nosotros', description: 'Conoce ARIS Vietnam',
      children: [
        { href: '/ja/about-us#overview', label: 'RESUMEN', title: 'Resumen', description: 'Resumen' },
        { href: '/ja/about-us#ceo-message', label: 'MENSAJE DEL CEO', title: 'Mensaje del CEO', description: 'Mensaje del CEO' },
        { href: '/ja/about-us#vision-mission', label: 'VISIÓN Y MISIÓN', title: 'Visión y Misión', description: 'Visión y Misión' },
        { href: '/ja/about-us#profile', label: 'PERFIL DE LA EMPRESA', title: 'Perfil de la empresa', description: 'Perfil de la empresa' },
        { href: '/ja/about-us#timeline', label: 'CRONOLOGÍA', title: 'Cronología', description: 'Cronología' },
        { href: '/ja/about-us#why-choose-us', label: '¿POR QUÉ ELEGIRNOS?', title: '¿Por qué elegirnos?', description: '¿Por qué elegirnos?' },
        { href: '/ja/about-us#our-customer', label: 'CLIENTES', title: 'Clientes', description: 'Clientes' },
        { href: '/ja/about-us#skills', label: 'HABILIDADES Y CAPACIDADES', title: 'Habilidades y Capacidades', description: 'Habilidades y Capacidades' },
      ]
    },
    { label: 'PROYECTOS', href: '/ja/projects', title: 'Proyectos', description: 'Lista de proyectos' },
    {
      label: 'SERVICIOS', href: '/ja/#services', title: 'Servicios', description: 'Nuestros servicios',
      children: [
        { href: '/ja/service/web-development', title: 'DESARROLLO WEB', description: 'Sitios web modernos y responsivos', label: 'DESARROLLO WEB' },
        { href: '/ja/service/mobile-app', title: 'APLICACIONES MÓVILES', description: 'Apps profesionales para iOS y Android', label: 'APLICACIONES MÓVILES' },
        { href: '/ja/service/design', title: 'DISEÑO UI/UX', description: 'Interfaces bonitas y fáciles de usar', label: 'DISEÑO UI/UX' },
        { href: '/ja/service/consulting', title: 'CONSULTORÍA IT', description: 'Soluciones tecnológicas integrales', label: 'CONSULTORÍA IT' },
        { href: '/ja/service/ai', title: 'SOLUCIONES DE IA', description: 'Inteligencia Artificial y Machine Learning', label: 'SOLUCIONES DE IA' },
        { href: '/ja/service/iot', title: 'SOLUCIONES IOT', description: 'Internet de las cosas y dispositivos inteligentes', label: 'SOLUCIONES IOT' },
        { href: '/ja/service/cloud', title: 'SERVICIOS EN LA NUBE', description: 'Migración y gestión de la nube', label: 'SERVICIOS EN LA NUBE' },
        { href: '/ja/service/testing', title: 'PRUEBAS Y QA', description: 'Aseguramiento de calidad y pruebas de software', label: 'PRUEBAS Y QA' },
        { href: '/ja/service/maintenance', title: 'MANTENIMIENTO Y SOPORTE', description: 'Soporte y mantenimiento continuo', label: 'MANTENIMIENTO Y SOPORTE' }
      ]
    },
    { label: 'NOTICIAS', href: '/ja/news', title: 'Noticias', description: 'Últimas noticias y actualizaciones' },
    { label: 'CAPACITACIONES', href: '/ja/training', title: 'Capacitaciones', description: 'Programas de capacitación y talleres' },
    { label: 'CONTACTO', href: '/ja/#contact', title: 'Contacto', description: 'Contáctanos' }
  ],
  es: [
    { label: 'Inicio', href: '/es/', title: 'Inicio' },
    {
      label: 'SERVICIOS', href: '/es/#services', title: 'Servicios', description: 'Nuestros servicios',
      // children will be populated asynchronously elsewhere
    },
    {
      label: 'SOBRE NOSOTROS', href: '/es/about-us', title: 'Sobre nosotros', description: 'Conoce ARIS Vietnam',
      children: [
        { href: '/es/about-us#overview', label: 'RESUMEN', title: 'Resumen', description: 'Resumen' },
        { href: '/es/about-us#ceo-message', label: 'MENSAJE DEL CEO', title: 'Mensaje del CEO', description: 'Mensaje del CEO' },
        { href: '/es/about-us#vision-mission', label: 'VISIÓN Y MISIÓN', title: 'Visión y Misión', description: 'Visión y Misión' },
        { href: '/es/about-us#profile', label: 'PERFIL DE LA EMPRESA', title: 'Perfil de la empresa', description: 'Perfil de la empresa' },
        { href: '/es/about-us#timeline', label: 'CRONOLOGÍA', title: 'Cronología', description: 'Cronología' },
        { href: '/es/about-us#why-choose-us', label: '¿POR QUÉ ELEGIRNOS?', title: '¿Por qué elegirnos?', description: '¿Por qué elegirnos?' },
        { href: '/es/about-us#our-customer', label: 'CLIENTES', title: 'Clientes', description: 'Clientes' },
        { href: '/es/about-us#skills', label: 'HABILIDADES Y CAPACIDADES', title: 'Habilidades y Capacidades', description: 'Habilidades y Capacidades' },
      ]
    },
    { label: 'PROYECTOS', href: '/es/projects', title: 'Proyectos', description: 'Lista de proyectos' },
    { label: 'NOTICIAS', href: '/es/news', title: 'Noticias', description: 'Últimas noticias y actualizaciones' },
    { label: 'CONTACTO', href: '/es/#contact', title: 'Contacto', description: 'Contáctanos' }
  ]
};
