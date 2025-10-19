// servicesLoader.js - Load all services from individual JSON files
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function getAllServices() {
  const servicesDir = path.join(__dirname, 'services');
  
  // Check if services directory exists
  if (!fs.existsSync(servicesDir)) {
    console.warn('Services directory not found, falling back to services.json');
    // Fallback to old services.json if new structure doesn't exist
    try {
      const servicesData = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../content/services.json'), 'utf8')
      );
      return servicesData;
    } catch (error) {
      console.error('Error loading services.json:', error);
      return [];
    }
  }

  // Read all JSON files from services directory
  const files = fs.readdirSync(servicesDir).filter(file => file.endsWith('.json'));
  
  const services = files.map(file => {
    const filePath = path.join(servicesDir, file);
    const serviceData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return serviceData;
  });

  // Define the correct order (matching original services.json)
  const serviceOrder = [
    'pmu-permanent-makeup',
    'skincare-acne-treatment',
    'detox-herbal-hair-wash',
    'shading-ombre',
    'micro-blading',
    'hairs-strokes',
    'eyeliners',
    'lip-treatments',
    'dark-lips-remover'
  ];

  // Sort by the defined order
  return services.sort((a, b) => {
    const indexA = serviceOrder.indexOf(a.slug);
    const indexB = serviceOrder.indexOf(b.slug);
    return indexA - indexB;
  });
}

export function getServiceBySlug(slug) {
  const services = getAllServices();
  return services.find(service => service.slug === slug);
}

export function getServiceMenu(lang = 'en') {
  const services = getAllServices();
  return services.map(service => ({
    slug: service.slug,
    title: service.title[lang] || service.title.en,
    href: `/${lang === 'en' ? '' : lang + '/'}service/${service.slug}`
  }));
}
