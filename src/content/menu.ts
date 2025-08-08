// src/content/menu.ts
// Centralized menu config for all languages

export interface MenuItem {
  label: string;
  href: string;
  title: string;
  description: string;
  children?: MenuItem[];
}

export const menus: Record<string, MenuItem[]> = {
  en: [
    { label: 'Home', href: '/en/', title: 'Home', description: 'Go to homepage' },
    {
      label: 'About Us', href: '/en/about-us', title: 'About Us', description: 'Learn about ARIS Vietnam',
      children: [
        { href: '/en/about-us#overview', label: 'Overview', title: 'Overview', description: 'Overview' },
        { href: '/en/about-us#ceo-message', label: 'CEO Message', title: 'CEO Message', description: 'CEO Message' },
        { href: '/en/about-us#vision-mission', label: 'Vision & Mission', title: 'Vision & Mission', description: 'Vision & Mission' },
        { href: '/en/about-us#profile', label: 'Profile', title: 'Profile', description: 'Profile' },
        { href: '/en/about-us#timeline', label: 'Timeline', title: 'Timeline', description: 'Timeline' },
        { href: '/en/about-us#why-choose-us', label: 'Why Choose Us?', title: 'Why Choose Us?', description: 'Why Choose Us?' },
        { href: '/en/about-us#our-customer', label: 'Our Customer', title: 'Our Customer', description: 'Our Customer' },
        { href: '/en/about-us#skills', label: 'Skill & Abilities', title: 'Skill & Abilities', description: 'Skill & Abilities' },
        { href: '/en/about-us#technologies', label: 'Technologies', title: 'Technologies', description: 'Technologies' },
        { href: '/en/about-us#project-flow', label: 'Project Flow', title: 'Project Flow', description: 'Project Flow' },
        { href: '/en/about-us#team-structure', label: 'Project Team Structure', title: 'Project Team Structure', description: 'Project Team Structure' },
        { href: '/en/about-us#sustainability', label: 'Sustainability', title: 'Sustainability', description: 'Sustainability' },
        { href: '/en/about-us#community', label: 'Community Connect', title: 'Community Connect', description: 'Community Connect' }
      ]
    },
    {
      label: 'Projects',
      href: '/en/projects',
      title: 'Projects',
      description: 'Our project portfolio',
      children: [
        { href: '/en/projects/project-001/ai-chatbot', label: 'AI Chatbot', title: 'AI Chatbot', description: 'AI Chatbot' },
        { href: '/en/projects/project-002/e-commerce-platform', label: 'E-Commerce Platform', title: 'E-Commerce Platform', description: 'E-Commerce Platform' },
        { href: '/en/projects/project-003/iot-dashboard', label: 'IoT Dashboard', title: 'IoT Dashboard', description: 'IoT Dashboard' },
        { href: '/en/projects/project-004/mobile-banking-app', label: 'Mobile Banking App', title: 'Mobile Banking App', description: 'Mobile Banking App' },
        { href: '/en/projects/project-005/portfolio-website', label: 'Portfolio Website', title: 'Portfolio Website', description: 'Portfolio Website' },
        { href: '/en/projects/project-006/project-001', label: 'Project 001', title: 'Project 001', description: 'Project 001' },
        { href: '/en/projects/project-007/project-002', label: 'Project 002', title: 'Project 002', description: 'Project 002' },
        { href: '/en/projects/project-008/project-003', label: 'Project 003', title: 'Project 003', description: 'Project 003' }
      ]
    },
    {
      label: 'Services', href: '/en/#services', title: 'Services', description: 'Our services',
      children: [
        { href: '/en/service/web-development', title: 'Web Development', description: 'Modern and responsive websites', label: 'Web Development' },
        { href: '/en/service/mobile-app', title: 'Mobile Apps', description: 'Professional iOS and Android apps', label: 'Mobile Apps' },
        { href: '/en/service/design', title: 'UI/UX Design', description: 'Beautiful and user-friendly interfaces', label: 'UI/UX Design' },
        { href: '/en/service/consulting', title: 'IT Consulting', description: 'Comprehensive technology solutions', label: 'IT Consulting' },
        { href: '/en/service/ai', title: 'AI Solutions', description: 'Artificial Intelligence and Machine Learning', label: 'AI Solutions' },
        { href: '/en/service/iot', title: 'IoT Solutions', description: 'Internet of Things and smart devices', label: 'IoT Solutions' },
        { href: '/en/service/cloud', title: 'Cloud Services', description: 'Cloud migration and management', label: 'Cloud Services' },
        { href: '/en/service/testing', title: 'Testing & QA', description: 'Quality assurance and software testing', label: 'Testing & QA' },
        { href: '/en/service/maintenance', title: 'Maintenance & Support', description: 'Ongoing support and maintenance', label: 'Maintenance & Support' }
      ]
    },
    { label: 'News', href: '/en/news', title: 'News', description: 'Latest news and updates' },
    { label: 'Contact', href: '/en/#contact', title: 'Contact', description: 'Contact us' }
  ],
  vi: [
    { label: 'Trang chủ', href: '/vi/', title: 'Trang chủ', description: 'Về trang chủ' },
    {
      label: 'Về chúng tôi', href: '/vi/about-us', title: 'Về chúng tôi', description: 'Giới thiệu về ARIS Vietnam',
      children: [
        { href: '/vi/about-us#overview', label: 'Tổng quan', title: 'Tổng quan', description: 'Tổng quan' },
        { href: '/vi/about-us#ceo-message', label: 'Thông điệp CEO', title: 'Thông điệp CEO', description: 'Thông điệp CEO' },
        { href: '/vi/about-us#vision-mission', label: 'Tầm nhìn & Sứ mệnh', title: 'Tầm nhìn & Sứ mệnh', description: 'Tầm nhìn & Sứ mệnh' },
        { href: '/vi/about-us#profile', label: 'Hồ sơ công ty', title: 'Hồ sơ công ty', description: 'Hồ sơ công ty' },
        { href: '/vi/about-us#timeline', label: 'Dấu mốc phát triển', title: 'Dấu mốc phát triển', description: 'Dấu mốc phát triển' },
        { href: '/vi/about-us#why-choose-us', label: 'Tại sao chọn chúng tôi?', title: 'Tại sao chọn chúng tôi?', description: 'Tại sao chọn chúng tôi?' },
        { href: '/vi/about-us#our-customer', label: 'Khách hàng', title: 'Khách hàng', description: 'Khách hàng' },
        { href: '/vi/about-us#skills', label: 'Kỹ năng & Năng lực', title: 'Kỹ năng & Năng lực', description: 'Kỹ năng & Năng lực' },
        { href: '/vi/about-us#technologies', label: 'Công nghệ', title: 'Công nghệ', description: 'Công nghệ' },
        { href: '/vi/about-us#project-flow', label: 'Quy trình dự án', title: 'Quy trình dự án', description: 'Quy trình dự án' },
        { href: '/vi/about-us#team-structure', label: 'Cơ cấu dự án', title: 'Cơ cấu dự án', description: 'Cơ cấu dự án' },
        { href: '/vi/about-us#sustainability', label: 'Phát triển bền vững', title: 'Phát triển bền vững', description: 'Phát triển bền vững' },
        { href: '/vi/about-us#community', label: 'Kết nối cộng đồng', title: 'Kết nối cộng đồng', description: 'Kết nối cộng đồng' }
      ]
    },
    { label: 'Dự án', href: '/vi/projects', title: 'Dự án', description: 'Danh mục dự án' },
    {
      label: 'Dịch vụ', href: '/vi/#services', title: 'Dịch vụ', description: 'Các dịch vụ của chúng tôi',
      children: [
        { href: '/vi/service/web-development', title: 'Phát triển Web', description: 'Trang web hiện đại và responsive', label: 'Phát triển Web' },
        { href: '/vi/service/mobile-app', title: 'Ứng dụng Mobile', description: 'App iOS và Android chuyên nghiệp', label: 'Ứng dụng Mobile' },
        { href: '/vi/service/design', title: 'Thiết kế UI/UX', description: 'Giao diện đẹp và dễ sử dụng', label: 'Thiết kế UI/UX' },
        { href: '/vi/service/consulting', title: 'Tư vấn IT', description: 'Giải pháp công nghệ toàn diện', label: 'Tư vấn IT' },
        { href: '/vi/service/ai', title: 'Giải pháp AI', description: 'Trí tuệ nhân tạo và máy học', label: 'Giải pháp AI' },
        { href: '/vi/service/iot', title: 'Giải pháp IoT', description: 'Internet vạn vật và thiết bị thông minh', label: 'Giải pháp IoT' },
        { href: '/vi/service/cloud', title: 'Dịch vụ Cloud', description: 'Di chuyển và quản lý đám mây', label: 'Dịch vụ Cloud' },
        { href: '/vi/service/testing', title: 'Kiểm thử & QA', description: 'Đảm bảo chất lượng và kiểm thử phần mềm', label: 'Kiểm thử & QA' },
        { href: '/vi/service/maintenance', title: 'Bảo trì & Hỗ trợ', description: 'Hỗ trợ và bảo trì liên tục', label: 'Bảo trì & Hỗ trợ' }
      ]
    },
    { label: 'Tin tức', href: '/vi/news', title: 'Tin tức', description: 'Tin tức và cập nhật mới' },
    { label: 'Liên hệ', href: '/vi/#contact', title: 'Liên hệ', description: 'Liên hệ với chúng tôi' }
  ],
  ja: [
    { label: 'Inicio', href: '/ja/', title: 'Inicio', description: 'Ir a la página principal' },
    {
      label: 'Sobre nosotros', href: '/ja/about-us', title: 'Sobre nosotros', description: 'Conoce ARIS Vietnam',
      children: [
        { href: '/ja/about-us#overview', label: 'Resumen', title: 'Resumen', description: 'Resumen' },
        { href: '/ja/about-us#ceo-message', label: 'Mensaje del CEO', title: 'Mensaje del CEO', description: 'Mensaje del CEO' },
        { href: '/ja/about-us#vision-mission', label: 'Visión y Misión', title: 'Visión y Misión', description: 'Visión y Misión' },
        { href: '/ja/about-us#profile', label: 'Perfil de la empresa', title: 'Perfil de la empresa', description: 'Perfil de la empresa' },
        { href: '/ja/about-us#timeline', label: 'Cronología', title: 'Cronología', description: 'Cronología' },
        { href: '/ja/about-us#why-choose-us', label: '¿Por qué elegirnos?', title: '¿Por qué elegirnos?', description: '¿Por qué elegirnos?' },
        { href: '/ja/about-us#our-customer', label: 'Clientes', title: 'Clientes', description: 'Clientes' },
        { href: '/ja/about-us#skills', label: 'Habilidades y Capacidades', title: 'Habilidades y Capacidades', description: 'Habilidades y Capacidades' },
        { href: '/ja/about-us#technologies', label: 'Tecnologías', title: 'Tecnologías', description: 'Tecnologías' },
        { href: '/ja/about-us#project-flow', label: 'Flujo de Proyecto', title: 'Flujo de Proyecto', description: 'Flujo de Proyecto' },
        { href: '/ja/about-us#team-structure', label: 'Estructura del Equipo', title: 'Estructura del Equipo', description: 'Estructura del Equipo' },
        { href: '/ja/about-us#sustainability', label: 'Sostenibilidad', title: 'Sostenibilidad', description: 'Sostenibilidad' },
        { href: '/ja/about-us#community', label: 'Conexión Comunitaria', title: 'Conexión Comunitaria', description: 'Conexión Comunitaria' }
      ]
    },
    { label: 'Proyectos', href: '/ja/projects', title: 'Proyectos', description: 'Lista de proyectos' },
    {
      label: 'Servicios', href: '/ja/#services', title: 'Servicios', description: 'Nuestros servicios',
      children: [
        { href: '/ja/service/web-development', title: 'Desarrollo Web', description: 'Sitios web modernos y responsivos', label: 'Desarrollo Web' },
        { href: '/ja/service/mobile-app', title: 'Aplicaciones Móviles', description: 'Apps profesionales para iOS y Android', label: 'Aplicaciones Móviles' },
        { href: '/ja/service/design', title: 'Diseño UI/UX', description: 'Interfaces bonitas y fáciles de usar', label: 'Diseño UI/UX' },
        { href: '/ja/service/consulting', title: 'Consultoría IT', description: 'Soluciones tecnológicas integrales', label: 'Consultoría IT' },
        { href: '/ja/service/ai', title: 'Soluciones de IA', description: 'Inteligencia Artificial y Machine Learning', label: 'Soluciones de IA' },
        { href: '/ja/service/iot', title: 'Soluciones IoT', description: 'Internet de las cosas y dispositivos inteligentes', label: 'Soluciones IoT' },
        { href: '/ja/service/cloud', title: 'Servicios en la Nube', description: 'Migración y gestión de la nube', label: 'Servicios en la Nube' },
        { href: '/ja/service/testing', title: 'Pruebas y QA', description: 'Aseguramiento de calidad y pruebas de software', label: 'Pruebas y QA' },
        { href: '/ja/service/maintenance', title: 'Mantenimiento y Soporte', description: 'Soporte y mantenimiento continuo', label: 'Mantenimiento y Soporte' }
      ]
    },
    { label: 'Noticias', href: '/ja/news', title: 'Noticias', description: 'Últimas noticias y actualizaciones' },
    { label: 'Contacto', href: '/ja/#contact', title: 'Contacto', description: 'Contáctanos' }
  ]
};
