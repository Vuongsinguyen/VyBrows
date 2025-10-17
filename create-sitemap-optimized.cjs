// Script tối ưu để tạo sitemap cho Sitelinks
const fs = require('fs');

// Định nghĩa các trang chính với priority cao
const pages = [
  // Homepage - Highest Priority
  { path: '', priority: 1.0, changefreq: 'daily', langs: ['en', 'es', 'ja', 'ko', 'vi'] },
  
  // Main Navigation Pages - High Priority (For Sitelinks)
  { path: 'about-us', priority: 0.9, changefreq: 'weekly', langs: ['en', 'ja', 'vi', 'es', 'ko'] },
  { path: 'contact', priority: 0.9, changefreq: 'weekly', langs: ['en', 'es', 'ja', 'ko', 'vi'] },
  { path: 'training', priority: 0.9, changefreq: 'weekly', langs: ['en', 'es', 'ja', 'ko', 'vi'] },
  { path: 'news', priority: 0.8, changefreq: 'daily', langs: ['en', 'ja', 'vi'] },
  
  // Top Services - High Priority (For Sitelinks)
  { path: 'service/micro-blading', priority: 0.9, changefreq: 'weekly', langs: ['en', 'es', 'ja', 'ko', 'vi'] },
  { path: 'service/pmu-permanent-makeup', priority: 0.9, changefreq: 'weekly', langs: ['en', 'es', 'ja', 'ko', 'vi'] },
  { path: 'service/shading-ombre', priority: 0.85, changefreq: 'weekly', langs: ['en', 'es', 'ja', 'ko', 'vi'] },
  { path: 'service/lip-treatments', priority: 0.85, changefreq: 'weekly', langs: ['en', 'es', 'ja', 'ko', 'vi'] },
  { path: 'service/eyeliners', priority: 0.85, changefreq: 'weekly', langs: ['en', 'es', 'ja', 'ko', 'vi'] },
  
  // Other Services - Medium Priority
  { path: 'service/hairs-strokes', priority: 0.8, changefreq: 'weekly', langs: ['en', 'es', 'ja', 'ko', 'vi'] },
  { path: 'service/dark-lips-remover', priority: 0.75, changefreq: 'weekly', langs: ['en', 'es', 'ja', 'ko', 'vi'] },
  { path: 'service/detox-herbal-hair-wash', priority: 0.75, changefreq: 'weekly', langs: ['en', 'es', 'ja', 'ko', 'vi'] },
  { path: 'service/skincare-acne-treatment', priority: 0.75, changefreq: 'weekly', langs: ['en', 'es', 'ja', 'ko', 'vi'] },
  
  // Training Pages - High Priority
  { path: 'training/pmu-foundation', priority: 0.85, changefreq: 'weekly', langs: ['en', 'es', 'ja', 'ko', 'vi'] },
  { path: 'training/advanced-microblading', priority: 0.85, changefreq: 'weekly', langs: ['en', 'es', 'ja', 'ko', 'vi'] },
  { path: 'training/ombre-powder-brows', priority: 0.8, changefreq: 'weekly', langs: ['en', 'es', 'ja', 'ko', 'vi'] },
  { path: 'training/lip-blush-training', priority: 0.8, changefreq: 'weekly', langs: ['en', 'es', 'ja', 'ko', 'vi'] },
  { path: 'training/combo-brow-technique', priority: 0.8, changefreq: 'weekly', langs: ['en', 'es', 'ja', 'ko', 'vi'] },
  { path: 'training/business-mastery', priority: 0.8, changefreq: 'weekly', langs: ['en', 'es', 'ja', 'ko', 'vi'] },
  
  // About Us Sub-pages - Medium Priority
  { path: 'about-us/why-choose-us', priority: 0.75, changefreq: 'monthly', langs: ['en', 'ja', 'vi'] },
  { path: 'about-us/expertise-experience', priority: 0.75, changefreq: 'monthly', langs: ['en', 'ja', 'vi'] },
  { path: 'about-us/safe-painless', priority: 0.75, changefreq: 'monthly', langs: ['en', 'ja', 'vi'] },
  { path: 'about-us/world-class-training', priority: 0.75, changefreq: 'monthly', langs: ['en', 'ja', 'vi'] },
  { path: 'about-us/natural-stunning', priority: 0.75, changefreq: 'monthly', langs: ['en', 'ja', 'vi'] },
];

// Special pages without multilingual support
const specialPages = [
  { path: 'BookStepAction', priority: 0.5, changefreq: 'monthly', langs: [] }
];

const baseUrl = 'https://vybrowsbeauty.com';
const today = new Date().toISOString().split('T')[0];
const lastmod = `${today}T15:00:00+00:00`;

// Build URL helper
function buildUrl(lang, path) {
  if (path === '') {
    // Homepage
    return lang === 'en' ? `${baseUrl}/` : `${baseUrl}/${lang}/`;
  }
  // Other pages
  return lang === 'en' ? `${baseUrl}/${path}/` : `${baseUrl}/${lang}/${path}/`;
}

// Generate sitemap XML
let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

// Process regular pages with multilingual support
pages.forEach(page => {
  page.langs.forEach(lang => {
    const url = buildUrl(lang, page.path);
    
    xml += `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
`;
    
    // Add hreflang for all available languages
    page.langs.forEach(hrefLang => {
      const hrefUrl = buildUrl(hrefLang, page.path);
      xml += `    <xhtml:link rel="alternate" hreflang="${hrefLang}" href="${hrefUrl}"/>
`;
    });
    
    // Add x-default (pointing to English version)
    const defaultUrl = buildUrl('en', page.path);
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultUrl}"/>
`;
    
    xml += `  </url>
`;
  });
});

// Process special pages without multilingual support
specialPages.forEach(page => {
  const url = `${baseUrl}/${page.path}/`;
  xml += `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
});

xml += `</urlset>`;

// Write to file
fs.writeFileSync('public/sitemap-0.xml', xml);

// Stats
const totalUrls = pages.reduce((sum, p) => sum + p.langs.length, 0) + specialPages.length;
console.log('✅ Sitemap created successfully!');
console.log(`📊 Total URLs: ${totalUrls}`);
console.log(`📅 Last Modified: ${lastmod}`);
console.log(`\n📌 Priority distribution:`);
console.log(`   - Priority 1.0 (Homepage): ${pages.filter(p => p.priority === 1.0).length * 5} URLs`);
console.log(`   - Priority 0.9 (Main pages): ${pages.filter(p => p.priority === 0.9).reduce((s, p) => s + p.langs.length, 0)} URLs`);
console.log(`   - Priority 0.85-0.8 (Services/Training): ${pages.filter(p => p.priority >= 0.8 && p.priority < 0.9).reduce((s, p) => s + p.langs.length, 0)} URLs`);
console.log(`   - Priority 0.75 (Sub-pages): ${pages.filter(p => p.priority === 0.75).reduce((s, p) => s + p.langs.length, 0)} URLs`);
