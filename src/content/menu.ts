// src/content/menu.ts
// Centralized menu config for all languages


export interface MenuItem {
  label: string;
  href: string;
  title: string;
  description: string;
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

export const menus: Record<string, MenuItem[]> = {
  en: [
    { label: 'HOME', href: '/en/', title: 'Home', description: 'Go to homepage' },
    {
      label: 'SERVICES', href: '/en/#services', title: 'Services', description: 'Our services',
      // children will be populated asynchronously elsewhere
    },
    {
      label: 'ABOUT US', href: '/en/about-us', title: 'About Us', description: 'Learn about ARIS Vietnam',
      children: [
        { href: '/en/about-us#overview', label: 'OVERVIEW', title: 'Overview', description: 'Overview' },
        { href: '/en/about-us#ceo-message', label: 'CEO MESSAGE', title: 'CEO Message', description: 'CEO Message' },
        { href: '/en/about-us#vision-mission', label: 'VISION & MISSION', title: 'Vision & Mission', description: 'Vision & Mission' },
        { href: '/en/about-us#profile', label: 'PROFILE', title: 'Profile', description: 'Profile' },
        { href: '/en/about-us#timeline', label: 'TIMELINE', title: 'Timeline', description: 'Timeline' },
        { href: '/en/about-us#why-choose-us', label: 'WHY CHOOSE US?', title: 'Why Choose Us?', description: 'Why Choose Us?' },
        { href: '/en/about-us#our-customer', label: 'OUR CUSTOMER', title: 'Our Customer', description: 'Our Customer' },
        { href: '/en/about-us#skills', label: 'SKILL & ABILITIES', title: 'Skill & Abilities', description: 'Skill & Abilities' },
        { href: '/en/about-us#technologies', label: 'TECHNOLOGIES', title: 'Technologies', description: 'Technologies' },
        { href: '/en/about-us#project-flow', label: 'PROJECT FLOW', title: 'Project Flow', description: 'Project Flow' },
        { href: '/en/about-us#team-structure', label: 'PROJECT TEAM STRUCTURE', title: 'Project Team Structure', description: 'Project Team Structure' },
        { href: '/en/about-us#sustainability', label: 'SUSTAINABILITY', title: 'Sustainability', description: 'Sustainability' },
        { href: '/en/about-us#community', label: 'COMMUNITY CONNECT', title: 'Community Connect', description: 'Community Connect' }
      ]
    },
    {
      label: 'TRAINING', href: '/en/training', title: 'Training', description: 'Training programs and workshops'
    },
    {
      label: 'SOLUTIONS', href: '/en/solutions', title: 'Solutions', description: 'Our solutions'
    },
    {
      label: 'COMMUNICATION', href: '/en/communication', title: 'Communication', description: 'Communication'
    },
    {
      label: 'CONTACT', href: '/en/#contact', title: 'Contact', description: 'Contact us'
    }
  ],
  vi: [
    { label: 'TRANG CHỦ', href: '/vi/', title: 'Trang chủ', description: 'Về trang chủ' },
    {
      label: 'VỀ CHÚNG TÔI', href: '/vi/about-us', title: 'Về chúng tôi', description: 'Giới thiệu về ARIS Vietnam',
      children: [
        { href: '/vi/about-us#overview', label: 'TỔNG QUAN', title: 'Tổng quan', description: 'Tổng quan' },
        { href: '/vi/about-us#ceo-message', label: 'THÔNG ĐIỆP CEO', title: 'Thông điệp CEO', description: 'Thông điệp CEO' },
        { href: '/vi/about-us#vision-mission', label: 'TẦM NHÌN & SỨ MỆNH', title: 'Tầm nhìn & Sứ mệnh', description: 'Tầm nhìn & Sứ mệnh' },
        { href: '/vi/about-us#profile', label: 'HỒ SƠ CÔNG TY', title: 'Hồ sơ công ty', description: 'Hồ sơ công ty' },
        { href: '/vi/about-us#timeline', label: 'DẤU MỐC PHÁT TRIỂN', title: 'Dấu mốc phát triển', description: 'Dấu mốc phát triển' },
        { href: '/vi/about-us#why-choose-us', label: 'TẠI SAO CHỌN CHÚNG TÔI?', title: 'Tại sao chọn chúng tôi?', description: 'Tại sao chọn chúng tôi?' },
        { href: '/vi/about-us#our-customer', label: 'KHÁCH HÀNG', title: 'Khách hàng', description: 'Khách hàng' },
        { href: '/vi/about-us#skills', label: 'KỸ NĂNG & NĂNG LỰC', title: 'Kỹ năng & Năng lực', description: 'Kỹ năng & Năng lực' },
        { href: '/vi/about-us#technologies', label: 'CÔNG NGHỆ', title: 'Công nghệ', description: 'Công nghệ' },
        { href: '/vi/about-us#project-flow', label: 'QUY TRÌNH DỰ ÁN', title: 'Quy trình dự án', description: 'Quy trình dự án' },
        { href: '/vi/about-us#team-structure', label: 'CƠ CẤU DỰ ÁN', title: 'Cơ cấu dự án', description: 'Cơ cấu dự án' },
        { href: '/vi/about-us#sustainability', label: 'PHÁT TRIỂN BỀN VỮNG', title: 'Phát triển bền vững', description: 'Phát triển bền vững' },
        { href: '/vi/about-us#community', label: 'KẾT NỐI CỘNG ĐỒNG', title: 'Kết nối cộng đồng', description: 'Kết nối cộng đồng' }
      ]
    },
    { label: 'DỰ ÁN', href: '/vi/projects', title: 'Dự án', description: 'Danh mục dự án' },
    {
      label: 'DỊCH VỤ', href: '/vi/#services', title: 'Dịch vụ', description: 'Các dịch vụ của chúng tôi',
      children: [
        { href: '/vi/service/web-development', title: 'PHÁT TRIỂN WEB', description: 'Trang web hiện đại và responsive', label: 'PHÁT TRIỂN WEB' },
        { href: '/vi/service/mobile-app', title: 'ỨNG DỤNG MOBILE', description: 'App iOS và Android chuyên nghiệp', label: 'ỨNG DỤNG MOBILE' },
        { href: '/vi/service/design', title: 'THIẾT KẾ UI/UX', description: 'Giao diện đẹp và dễ sử dụng', label: 'THIẾT KẾ UI/UX' },
        { href: '/vi/service/consulting', title: 'TƯ VẤN IT', description: 'Giải pháp công nghệ toàn diện', label: 'TƯ VẤN IT' },
        { href: '/vi/service/ai', title: 'GIẢI PHÁP AI', description: 'Trí tuệ nhân tạo và máy học', label: 'GIẢI PHÁP AI' },
        { href: '/vi/service/iot', title: 'GIẢI PHÁP IOT', description: 'Internet vạn vật và thiết bị thông minh', label: 'GIẢI PHÁP IOT' },
        { href: '/vi/service/cloud', title: 'DỊCH VỤ CLOUD', description: 'Di chuyển và quản lý đám mây', label: 'DỊCH VỤ CLOUD' },
        { href: '/vi/service/testing', title: 'KIỂM THỬ & QA', description: 'Đảm bảo chất lượng và kiểm thử phần mềm', label: 'KIỂM THỬ & QA' },
        { href: '/vi/service/maintenance', title: 'BẢO TRÌ & HỖ TRỢ', description: 'Hỗ trợ và bảo trì liên tục', label: 'BẢO TRÌ & HỖ TRỢ' }
      ]
    },
    { label: 'TIN TỨC', href: '/vi/news', title: 'Tin tức', description: 'Tin tức và cập nhật mới' },
    { label: 'ĐÀO TẠO', href: '/vi/training', title: 'Đào tạo', description: 'Chương trình đào tạo và workshop' },
    { label: 'LIÊN HỆ', href: '/vi/#contact', title: 'Liên hệ', description: 'Liên hệ với chúng tôi' }
  ],
  ja: [
    { label: 'INICIO', href: '/ja/', title: 'Inicio', description: 'Ir a la página principal' },
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
        { href: '/ja/about-us#technologies', label: 'TECNOLOGÍAS', title: 'Tecnologías', description: 'Tecnologías' },
        { href: '/ja/about-us#project-flow', label: 'FLUJO DE PROYECTO', title: 'Flujo de Proyecto', description: 'Flujo de Proyecto' },
        { href: '/ja/about-us#team-structure', label: 'ESTRUCTURA DEL EQUIPO', title: 'Estructura del Equipo', description: 'Estructura del Equipo' },
        { href: '/ja/about-us#sustainability', label: 'SOSTENIBILIDAD', title: 'Sostenibilidad', description: 'Sostenibilidad' },
        { href: '/ja/about-us#community', label: 'CONEXIÓN COMUNITARIA', title: 'Conexión Comunitaria', description: 'Conexión Comunitaria' }
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
  ]
};
