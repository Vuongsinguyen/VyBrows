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
    { label: 'サービス', href: '/ja/#services', title: 'サービス' },
    {
      label: '会社情報', href: '/ja/about-us', title: '会社情報', description: 'ARIS Vietnam について',
      children: [
        { href: '/ja/about-us#overview', label: '概要', title: '概要', description: '概要' },
        { href: '/ja/about-us#ceo-message', label: 'CEOメッセージ', title: 'CEOメッセージ', description: 'CEOメッセージ' },
        { href: '/ja/about-us#vision-mission', label: 'ビジョンとミッション', title: 'ビジョンとミッション', description: 'ビジョンとミッション' },
        { href: '/ja/about-us#profile', label: '会社概要', title: '会社概要', description: '会社概要' },
        { href: '/ja/about-us#timeline', label: '沿革', title: '沿革', description: '沿革' },
        { href: '/ja/about-us#why-choose-us', label: '選ばれる理由', title: '選ばれる理由', description: '選ばれる理由' },
        { href: '/ja/about-us#our-customer', label: 'お客様', title: 'お客様', description: 'お客様' },
        { href: '/ja/about-us#skills', label: 'スキルとケイパビリティ', title: 'スキルとケイパビリティ', description: 'スキルとケイパビリティ' },
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
    { label: 'CONTACTO', href: '/es/#contact', title: 'Contacto', description: 'Contáctanos' }
  ]
};
