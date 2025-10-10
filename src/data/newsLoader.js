import newsIndex from './news/index.json';

// Import all individual news files
import news1 from './news/1.json';
import news2 from './news/2.json';
import news3 from './news/3.json';
import news4 from './news/4.json';

// Create a map of news data
const newsData = {
  1: news1,
  2: news2,
  3: news3,
  4: news4
};

// Get all news articles
export function getAllNews() {
  return newsIndex.newsIndex.map(item => ({
    ...newsData[item.id],
    featured: item.featured
  }));
}

// Get a specific news article by ID
export function getNewsById(id) {
  return newsData[id] || null;
}

// Get featured news
export function getFeaturedNews() {
  return newsIndex.newsIndex
    .filter(item => item.featured)
    .map(item => ({
      ...newsData[item.id],
      featured: item.featured
    }));
}

// Get news list for navigation
export function getNewsIndex() {
  return newsIndex.newsIndex;
}

// Legacy export for backward compatibility
export const news = getAllNews();