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
  // English uses /service/ without prefix, other languages use /{lang}/service/
  const basePrefix = lang === 'en' ? '' : `/${lang}`;
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
  { href: '/about-us/why-choose-us', label: 'WHY CHOOSE US', title: 'WHY CHOOSE US', description: 'Why Choose Us section' },
  { href: '/about-us/expertise-experience', label: 'EXPERTISE & EXPERIENCE', title: 'EXPERTISE & EXPERIENCE', description: 'Expertise & Experience section' },
  { href: '/about-us/safe-painless', label: 'SAFE & PAINLESS TECHNIQUES', title: 'SAFE & PAINLESS TECHNIQUES', description: 'Safe & Painless Techniques section' },
  { href: '/about-us/world-class-training', label: 'WORLD-CLASS TRAINING', title: 'WORLD-CLASS TRAINING', description: 'World-Class Training section' },
  { href: '/about-us/natural-stunning', label: 'NATURAL & STUNNING RESULTS', title: 'NATURAL & STUNNING RESULTS', description: 'Natural & Stunning Results section' }
      ]
    },
    { label: 'NEWS', href: '/news', title: 'News', description: 'Latest news and updates' },
    { label: 'TRAINING', href: '/training', title: 'Training' },
    { label: 'CONTACT', href: '/contact', title: 'Contact' }
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
    { label: 'TIN TỨC', href: '/vi/news', title: 'Tin tức', description: 'Tin tức và cập nhật mới nhất' },
    { label: 'ĐÀO TẠO', href: '/vi/training', title: 'Đào tạo' },
    { label: 'LIÊN LẠC', href: '/vi/contact', title: 'Liên lạc' }
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
    { label: 'ニュース', href: '/ja/news', title: 'ニュース', description: '最新ニュースとアップデート' },
    { label: 'トレーニング', href: '/ja/training', title: 'トレーニング', description: '研修・ワークショップ' },
    { label: 'お問い合わせ', href: '/ja/contact', title: 'お問い合わせ', description: 'お問い合わせ' }
  ],
  es: [
    { label: 'Inicio', href: '/es/', title: 'Inicio' },
    {
      label: 'SERVICIOS', href: '/es/#services', title: 'Servicios', description: 'Nuestros servicios',
      // children will be populated asynchronously elsewhere
    },
    {
      label: 'SOBRE NOSOTROS', href: '/es/about-us', title: 'Sobre nosotros', description: 'Conoce Vy Brows Beauty',
      children: [
        { href: '/es/about-us/why-choose-us', label: '¿POR QUÉ ELEGIRNOS?', title: '¿Por qué elegirnos?', description: '¿Por qué elegirnos?' },
        { href: '/es/about-us/expertise-experience', label: 'EXPERIENCIA Y PERICIA', title: 'Experiencia y Pericia', description: 'Experiencia y Pericia' },
        { href: '/es/about-us/safe-painless', label: 'TÉCNICAS SEGURAS Y SIN DOLOR', title: 'Técnicas Seguras y Sin Dolor', description: 'Técnicas Seguras y Sin Dolor' },
        { href: '/es/about-us/world-class-training', label: 'ENTRENAMIENTO DE CLASE MUNDIAL', title: 'Entrenamiento de Clase Mundial', description: 'Entrenamiento de Clase Mundial' },
        { href: '/es/about-us/natural-stunning', label: 'RESULTADOS NATURALES Y IMPRESIONANTES', title: 'Resultados Naturales y Impresionantes', description: 'Resultados Naturales y Impresionantes' }
      ]
    },
    { label: 'NOTICIAS', href: '/es/news', title: 'Noticias', description: 'Últimas noticias y actualizaciones' },
    { label: 'FORMACIÓN', href: '/es/training', title: 'Formación', description: 'Programas de formación' },
    { label: 'CONTACTO', href: '/es/contact', title: 'Contacto', description: 'Contáctanos' }
  ],
  ko: [
    { label: '홈', href: '/ko/', title: '홈' },
    { label: '서비스', href: '/ko/#services', title: '서비스' },
    {
      label: '회사 소개', href: '/ko/about-us', title: '회사 소개', description: 'Vy Brows Beauty 소개',
      children: [
        { href: '/ko/about-us/why-choose-us', label: '선택받는 이유', title: '선택받는 이유', description: '선택받는 이유' },
        { href: '/ko/about-us/expertise-experience', label: '전문성과 경험', title: '전문성과 경험', description: '전문성과 경험' },
        { href: '/ko/about-us/safe-painless', label: '안전하고 무통증 기법', title: '안전하고 무통증 기법', description: '안전하고 무통증 기법' },
        { href: '/ko/about-us/world-class-training', label: '세계 수준의 교육', title: '세계 수준의 교육', description: '세계 수준의 교육' },
        { href: '/ko/about-us/natural-stunning', label: '자연스럽고 놀라운 결과', title: '자연스럽고 놀라운 결과', description: '자연스럽고 놀라운 결과' }
      ]
    },
    { label: '뉴스', href: '/ko/news', title: '뉴스', description: '최신 뉴스와 업데이트' },
    { label: '교육', href: '/ko/training', title: '교육', description: '교육 및 워크숍' },
    { label: '문의', href: '/ko/contact', title: '문의', description: '문의하기' }
  ]
};
