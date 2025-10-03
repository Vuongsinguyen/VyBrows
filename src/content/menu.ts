// src/content/menu.ts
// Centralized menu config for all languages


export interface MenuItem {
  label: string;
  href: string;
  title?: string;
  description?: string;
  children?: MenuItem[];
}

// Use services.json for dynamic SERVICES menu
export async function getServiceMenu(lang: string) {
  const servicesData = await import('./services.json').then(m => m.default);
  // All languages now use /{lang}/service/ prefix since we removed the standalone /service/ route
  const basePrefix = `/${lang}`;
  return servicesData.map((service: any) => ({
    href: `${basePrefix}/service/${service.slug}`,
    title: service.title[lang] || service.title.en,
    description: service.description[lang] || service.description.en,
    label: service.title[lang] || service.title.en,
  }));
}

// Menu cấu hình cho từng ngôn ngữ
export const menus: Record<string, MenuItem[]> = {
  en: [
    { label: 'HOME', href: '/', title: 'Home' },
    { label: 'SERVICES', href: '/#services', title: 'Services' },
    {
      label: 'ABOUT US', href: '/about-us', title: 'About Us',
      children: [
  { href: '/en/about-us/why-choose-us', label: 'WHY CHOOSE US', title: 'WHY CHOOSE US', description: 'Why Choose Us section' },
  { href: '/en/about-us/expertise-experience', label: 'EXPERTISE & EXPERIENCE', title: 'EXPERTISE & EXPERIENCE', description: 'Expertise & Experience section' },
  { href: '/en/about-us/safe-painless', label: 'SAFE & PAINLESS TECHNIQUES', title: 'SAFE & PAINLESS TECHNIQUES', description: 'Safe & Painless Techniques section' },
  { href: '/en/about-us/world-class-training', label: 'WORLD-CLASS TRAINING', title: 'WORLD-CLASS TRAINING', description: 'World-Class Training section' },
  { href: '/en/about-us/natural-stunning', label: 'NATURAL & STUNNING RESULTS', title: 'NATURAL & STUNNING RESULTS', description: 'Natural & Stunning Results section' }
      ]
    },
    { label: 'TRAINING', href: '/en/training', title: 'Training' },
    { label: 'COMMUNICATION', href: '/communication', title: 'Communication' },
    { label: 'CONTACT', href: '/#contact', title: 'Contact' }
  ],
  vi: [
    { label: 'TRANG CHỦ', href: '/vi/', title: 'Trang chủ' },
    { label: 'DỊCH VỤ', href: '/vi/#services', title: 'Dịch vụ' },
    {
      label: 'GIỚI THIỆU', href: '/vi/about-us', title: 'Giới thiệu',
      children: [
  { href: '/vi/about-us/why-choose-us', label: 'VÌ SAO CHỌN CHÚNG TÔI', title: 'VÌ SAO CHỌN CHÚNG TÔI', description: 'Why Choose Us section' },
  { href: '/vi/about-us/expertise-experience', label: 'CHUYÊN MÔN & KINH NGHIỆM', title: 'CHUYÊN MÔN & KINH NGHIỆM', description: 'Expertise & Experience section' },
  { href: '/vi/about-us/safe-painless', label: 'KỸ THUẬT AN TOÀN & KHÔNG ĐAU', title: 'KỸ THUẬT AN TOÀN & KHÔNG ĐAU', description: 'Safe & Painless Techniques section' },
  { href: '/vi/about-us/world-class-training', label: 'ĐÀO TẠO ĐẲNG CẤP QUỐC TẾ', title: 'ĐÀO TẠO ĐẲNG CẤP QUỐC TẾ', description: 'World-Class Training section' },
  { href: '/vi/about-us/natural-stunning', label: 'KẾT QUẢ TỰ NHIÊN & RẠNG RỠ', title: 'KẾT QUẢ TỰ NHIÊN & RẠNG RỠ', description: 'Natural & Stunning Results section' }
      ]
    },
    { label: 'ĐÀO TẠO', href: '/vi/training', title: 'Đào tạo' },
    { label: 'TRUYỀN THÔNG', href: '/vi/communication', title: 'Truyền thông' },
    { label: 'LIÊN LẠC', href: '/vi/#contact', title: 'Liên lạc' }
  ],
  ja: [
    { label: 'ホーム', href: '/ja/', title: 'ホーム' },
    { label: 'サービス', href: '/ja/#services', title: 'サービス' },
    {
      label: '会社情報', href: '/ja/about-us', title: '会社情報', description: 'VyBrows Academy について',
      children: [
        { href: '/ja/about-us/why-choose-us', label: 'なぜ私たちを選ぶのか', title: 'なぜ私たちを選ぶのか', description: 'Why Choose Us section' },
        { href: '/ja/about-us/expertise-experience', label: '専門性と経験', title: '専門性と経験', description: 'Expertise & Experience section' },
        { href: '/ja/about-us/safe-painless', label: '安全で痛みのない技術', title: '安全で痛みのない技術', description: 'Safe & Painless Techniques section' },
        { href: '/ja/about-us/world-class-training', label: '世界クラスのトレーニング', title: '世界クラスのトレーニング', description: 'World-Class Training section' },
        { href: '/ja/about-us/natural-stunning', label: '自然で美しい結果', title: '自然で美しい結果', description: 'Natural & Stunning Results section' }
      ]
    },
    { label: 'プロジェクト', href: '/ja/projects', title: 'プロジェクト', description: 'プロジェクト一覧' },
    { label: 'ニュース', href: '/ja/news', title: 'ニュース', description: '最新ニュースとアップデート' },
    { label: 'トレーニング', href: '/ja/training', title: 'トレーニング', description: '研修・ワークショップ' },
    { label: 'お問い合わせ', href: '/ja/#contact', title: 'お問い合わせ', description: 'お問い合わせ' }
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
    { label: 'FORMACIÓN', href: '/es/training', title: 'Formación', description: 'Programas de formación' },
    { label: 'CONTACTO', href: '/es/#contact', title: 'Contacto', description: 'Contáctanos' }
  ],
  ko: [
    { label: '홈', href: '/ko/', title: '홈' },
    { label: '서비스', href: '/ko/#services', title: '서비스' },
    {
      label: '회사 소개', href: '/ko/about-us', title: '회사 소개', description: 'ARIS Vietnam 소개',
      children: [
        { href: '/ko/about-us#overview', label: '개요', title: '개요', description: '개요' },
        { href: '/ko/about-us#ceo-message', label: 'CEO 메시지', title: 'CEO 메시지', description: 'CEO 메시지' },
        { href: '/ko/about-us#vision-mission', label: '비전과 미션', title: '비전과 미션', description: '비전과 미션' },
        { href: '/ko/about-us#profile', label: '회사 프로필', title: '회사 프로필', description: '회사 프로필' },
        { href: '/ko/about-us#timeline', label: '연혁', title: '연혁', description: '연혁' },
        { href: '/ko/about-us#why-choose-us', label: '선택받는 이유', title: '선택받는 이유', description: '선택받는 이유' },
        { href: '/ko/about-us#our-customer', label: '고객사', title: '고객사', description: '고객사' },
        { href: '/ko/about-us#skills', label: '역량 및 기술', title: '역량 및 기술', description: '역량 및 기술' },
      ]
    },
    { label: '교육', href: '/ko/training', title: '교육', description: '교육 및 워크숍' },
    { label: '커뮤니케이션', href: '/ko/communication', title: '커뮤니케이션', description: '소통' },
    { label: '문의', href: '/ko/#contact', title: '문의', description: '문의하기' }
  ]
};
