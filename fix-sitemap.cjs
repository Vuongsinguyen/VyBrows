const fs = require('fs');

// Đọc sitemap gốc từ dist để lấy URLs chính xác
const originalSitemap = fs.readFileSync('dist/sitemap-0.xml', 'utf8');

// Extract URLs từ sitemap gốc
const urlMatches = originalSitemap.match(/<loc>([^<]+)<\/loc>/g);
const urls = urlMatches ? urlMatches.map(match => match.replace(/<\/?loc>/g, '')) : [];

// Tạo XML với format đẹp
let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

urls.forEach(url => {
  // Xác định priority dựa trên URL
  let priority = '0.6';
  if (url === 'https://vybrowsbeauty.com/') priority = '1.0';
  else if (url.includes('/service/') || url.includes('/training/')) priority = '0.8';
  else if (url.includes('/contact/') || url.includes('/about-us/')) priority = '0.7';

  xml += `  <url>
    <loc>${url}</loc>
    <lastmod>2025-10-10T15:00:00+00:00</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>
`;
});

xml += `</urlset>`;

// Ghi file
fs.writeFileSync('public/sitemap-0.xml', xml);
console.log(`Formatted sitemap created with ${urls.length} URLs`);