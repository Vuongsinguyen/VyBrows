// Script để tạo sitemap có format đẹp
const fs = require('fs');

const urls = [
  // Homepage
  { loc: 'https://vybrowsbeauty.com/', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/BookStepAction/', hreflang: [] },
  
  // About-us
  { loc: 'https://vybrowsbeauty.com/en/about-us/', hreflang: ['en', 'ja', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/en/about-us/expertise-experience/', hreflang: ['en', 'ja', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/en/about-us/natural-stunning/', hreflang: ['en', 'ja', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/en/about-us/safe-painless/', hreflang: ['en', 'ja', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/en/about-us/why-choose-us/', hreflang: ['en', 'ja', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/en/about-us/world-class-training/', hreflang: ['en', 'ja', 'vi'] },
  
  // Contact
  { loc: 'https://vybrowsbeauty.com/en/contact/', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  
  // News
  { loc: 'https://vybrowsbeauty.com/en/news/', hreflang: ['en', 'ja', 'vi'] },
  
  // Services
  { loc: 'https://vybrowsbeauty.com/en/service/dark-lips-remover/', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/en/service/detox-herbal-hair-wash/', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/en/service/eyeliners/', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/en/service/hairs-strokes/', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/en/service/lip-treatments/', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/en/service/micro-blading/', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/en/service/pmu-permanent-makeup/', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/en/service/shading-ombre/', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/en/service/skincare-acne-treatment/', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  
  // Training
  { loc: 'https://vybrowsbeauty.com/en/training/', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/en/training/advanced-microblading/', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/en/training/business-mastery/', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/en/training/combo-brow-technique/', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/en/training/lip-blush-training/', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/en/training/ombre-powder-brows/', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/en/training/pmu-foundation/', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] }
];

const languages = ['en', 'vi', 'ja', 'es', 'ko'];
const allUrls = [];

// Tạo URLs cho tất cả languages
urls.forEach(url => {
  if (url.hreflang.length === 0) {
    allUrls.push(url);
  } else {
    url.hreflang.forEach(lang => {
      const newUrl = {
        loc: url.loc.replace('/en/', `/${lang}/`).replace('vybrowsbeauty.com/', `vybrowsbeauty.com/${lang === 'en' ? '' : lang + '/'}`),
        hreflang: url.hreflang,
        priority: url.loc.includes('/service/') || url.loc.includes('/training/') ? '0.8' : 
                  url.loc === 'https://vybrowsbeauty.com/' ? '1.0' : '0.6',
        changefreq: 'weekly',
        lastmod: '2025-10-10T15:00:00+00:00'
      };
      allUrls.push(newUrl);
    });
  }
});

// Tạo XML
let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

allUrls.forEach(url => {
  xml += `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod || '2025-10-10T15:00:00+00:00'}</lastmod>
    <changefreq>${url.changefreq || 'weekly'}</changefreq>
    <priority>${url.priority || '0.6'}</priority>
`;
  
  if (url.hreflang && url.hreflang.length > 0) {
    url.hreflang.forEach(lang => {
      const hrefUrl = url.loc.replace(/\/(en|vi|ja|es|ko)\//, `/${lang}/`)
                             .replace('vybrowsbeauty.com/', `vybrowsbeauty.com/${lang === 'en' ? '' : lang + '/'}`);
      xml += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${hrefUrl}"/>
`;
    });
  }
  
  xml += `  </url>
`;
});

xml += `</urlset>`;

fs.writeFileSync('public/sitemap-0.xml', xml);
console.log('Sitemap created successfully!');
