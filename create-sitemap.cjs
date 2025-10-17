// Script để tạo sitemap có format đẹp và tối ưu cho Sitelinks
const fs = require('fs');

// Định nghĩa priority theo tầm quan trọng cho Sitelinks
const urls = [
  // Homepage - Highest Priority
  { loc: 'https://vybrowsbeauty.com/', priority: 1.0, changefreq: 'daily', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  
  // Main Navigation Pages - High Priority (For Sitelinks)
  { loc: 'https://vybrowsbeauty.com/about-us/', priority: 0.9, changefreq: 'weekly', hreflang: ['en', 'ja', 'vi', 'es', 'ko'] },
  { loc: 'https://vybrowsbeauty.com/contact/', priority: 0.9, changefreq: 'weekly', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/training/', priority: 0.9, changefreq: 'weekly', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/news/', priority: 0.8, changefreq: 'daily', hreflang: ['en', 'ja', 'vi'] },
  
  // Top Services - High Priority (For Sitelinks)
  { loc: 'https://vybrowsbeauty.com/service/micro-blading/', priority: 0.9, changefreq: 'weekly', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/service/pmu-permanent-makeup/', priority: 0.9, changefreq: 'weekly', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/service/shading-ombre/', priority: 0.85, changefreq: 'weekly', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/service/lip-treatments/', priority: 0.85, changefreq: 'weekly', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/service/eyeliners/', priority: 0.85, changefreq: 'weekly', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  
  // Other Services - Medium Priority
  { loc: 'https://vybrowsbeauty.com/service/hairs-strokes/', priority: 0.8, changefreq: 'weekly', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/service/dark-lips-remover/', priority: 0.75, changefreq: 'weekly', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/service/detox-herbal-hair-wash/', priority: 0.75, changefreq: 'weekly', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/service/skincare-acne-treatment/', priority: 0.75, changefreq: 'weekly', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  
  // Training Pages - High Priority
  { loc: 'https://vybrowsbeauty.com/training/pmu-foundation/', priority: 0.85, changefreq: 'weekly', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/training/advanced-microblading/', priority: 0.85, changefreq: 'weekly', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/training/ombre-powder-brows/', priority: 0.8, changefreq: 'weekly', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/training/lip-blush-training/', priority: 0.8, changefreq: 'weekly', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/training/combo-brow-technique/', priority: 0.8, changefreq: 'weekly', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/training/business-mastery/', priority: 0.8, changefreq: 'weekly', hreflang: ['en', 'es', 'ja', 'ko', 'vi'] },
  
  // About Us Sub-pages - Medium Priority
  { loc: 'https://vybrowsbeauty.com/about-us/why-choose-us/', priority: 0.75, changefreq: 'monthly', hreflang: ['en', 'ja', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/about-us/expertise-experience/', priority: 0.75, changefreq: 'monthly', hreflang: ['en', 'ja', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/about-us/safe-painless/', priority: 0.75, changefreq: 'monthly', hreflang: ['en', 'ja', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/about-us/world-class-training/', priority: 0.75, changefreq: 'monthly', hreflang: ['en', 'ja', 'vi'] },
  { loc: 'https://vybrowsbeauty.com/about-us/natural-stunning/', priority: 0.75, changefreq: 'monthly', hreflang: ['en', 'ja', 'vi'] },
  
  // Booking Page - Lower Priority (internal tool, not for sitelinks)
  { loc: 'https://vybrowsbeauty.com/BookStepAction/', priority: 0.5, changefreq: 'monthly', hreflang: [] }
];

const allUrls = [];
const today = new Date().toISOString().split('T')[0];
const lastmod = `${today}T15:00:00+00:00`;

// Tạo URLs cho tất cả languages
urls.forEach(url => {
  if (url.hreflang.length === 0) {
    // Pages without language versions (like BookStepAction)
    allUrls.push({
      loc: url.loc,
      priority: url.priority,
      changefreq: url.changefreq,
      lastmod: lastmod,
      hreflang: []
    });
  } else {
    // Create URL for each language
    url.hreflang.forEach(lang => {
      // Build proper URL based on language
      let locUrl = url.loc;
      
      // For homepage
      if (url.loc === 'https://vybrowsbeauty.com/') {
        locUrl = lang === 'en' ? 'https://vybrowsbeauty.com/' : `https://vybrowsbeauty.com/${lang}/`;
      } 
      // For other pages, add language prefix
      else {
        const pathPart = url.loc.replace('https://vybrowsbeauty.com/', '');
        locUrl = lang === 'en' ? 
          `https://vybrowsbeauty.com/${pathPart}` : 
          `https://vybrowsbeauty.com/${lang}/${pathPart}`;
      }
      
      allUrls.push({
        loc: locUrl,
        priority: url.priority,
        changefreq: url.changefreq,
        lastmod: lastmod,
        hreflang: url.hreflang,
        basePath: url.loc.replace('https://vybrowsbeauty.com/', '')
      });
    });
  }
});

// Sort URLs: Homepage first, then by priority (high to low), then alphabetically
allUrls.sort((a, b) => {
  if (a.loc === 'https://vybrowsbeauty.com/') return -1;
  if (b.loc === 'https://vybrowsbeauty.com/') return 1;
  if (b.priority !== a.priority) return b.priority - a.priority;
  return a.loc.localeCompare(b.loc);
});

// Tạo XML
let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

allUrls.forEach(url => {
  xml += `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
`;
  
  // Add hreflang links if available
  if (url.hreflang && url.hreflang.length > 0) {
    url.hreflang.forEach(lang => {
      let hrefUrl;
      const basePath = url.basePath || url.loc.replace('https://vybrowsbeauty.com/', '');
      
      if (basePath === '' || basePath === '/') {
        // Homepage
        hrefUrl = lang === 'en' ? 'https://vybrowsbeauty.com/' : `https://vybrowsbeauty.com/${lang}/`;
      } else {
        // Other pages
        hrefUrl = lang === 'en' ? 
          `https://vybrowsbeauty.com/${basePath}` : 
          `https://vybrowsbeauty.com/${lang}/${basePath}`;
      }
      
      xml += `    <xhtml:link rel="alternate" hreflang="${lang}" href="${hrefUrl}"/>
`;
    });
    
    // Add x-default (pointing to English version)
    const basePath = url.basePath || url.loc.replace('https://vybrowsbeauty.com/', '');
    const defaultUrl = basePath === '' || basePath === '/' ? 
      'https://vybrowsbeauty.com/' : 
      `https://vybrowsbeauty.com/${basePath}`;
    xml += `    <xhtml:link rel="alternate" hreflang="x-default" href="${defaultUrl}"/>
`;
  }
  
  xml += `  </url>
`;
});

xml += `</urlset>`;

fs.writeFileSync('public/sitemap-0.xml', xml);
console.log('✅ Sitemap created successfully!');
console.log(`📊 Total URLs: ${allUrls.length}`);
console.log(`📅 Last Modified: ${lastmod}`);
