// Script to convert services.json to individual multilingual JSON files
const fs = require('fs');
const path = require('path');

// Read the old services.json
const servicesData = JSON.parse(fs.readFileSync('./src/content/services.json', 'utf8'));

// Create services directory if not exists
const servicesDir = './src/data/services';
if (!fs.existsSync(servicesDir)) {
  fs.mkdirSync(servicesDir, { recursive: true });
}

// Translation helper (basic - you may want to enhance this)
const translations = {
  subtitle: {
    vi: {
      'Elevating Beauty, Simplifying Your Routine': 'Nâng Tầm Vẻ Đẹp, Đơn Giản Hóa Thói Quen Của Bạn',
      'Clear Skin, Clear Confidence': 'Làn Da Sạch, Tự Tin Rạng Ngời',
      'Restore Your Hair\'s Natural Vitality': 'Phục Hồi Sức Sống Tự Nhiên Cho Tóc',
      'Soft, Natural Gradient Brows': 'Lông Mày Chuyển Màu Mềm Mại, Tự Nhiên',
      'Hair-Like Strokes for Natural Brows': 'Nét Như Tóc Thật Cho Lông Mày Tự Nhiên',
      'Ultra-Fine Hair Simulation Technology': 'Công Nghệ Mô Phỏng Tóc Siêu Mịn',
      'Define Your Eyes, Enhance Your Beauty': 'Định Hình Đôi Mắt, Nâng Tầm Vẻ Đẹp',
      'Beautiful, Youthful Lips Naturally Enhanced': 'Đôi Môi Đẹp, Trẻ Trung Được Tăng Cường Tự Nhiên',
      'Restore Your Natural Lip Color': 'Phục Hồi Màu Môi Tự Nhiên'
    },
    ja: {
      'Elevating Beauty, Simplifying Your Routine': '美しさを高め、日常を簡素化',
      'Clear Skin, Clear Confidence': '透明肌、輝く自信',
      'Restore Your Hair\'s Natural Vitality': '髪本来の活力を取り戻す',
      'Soft, Natural Gradient Brows': 'ソフトで自然なグラデーション眉',
      'Hair-Like Strokes for Natural Brows': '自然な眉のための毛のようなストローク',
      'Ultra-Fine Hair Simulation Technology': '超微細ヘアシミュレーション技術',
      'Define Your Eyes, Enhance Your Beauty': '目を際立たせ、美しさを高める',
      'Beautiful, Youthful Lips Naturally Enhanced': '自然に美しく若々しい唇',
      'Restore Your Natural Lip Color': '自然な唇の色を取り戻す'
    },
    es: {
      'Elevating Beauty, Simplifying Your Routine': 'Elevando la Belleza, Simplificando tu Rutina',
      'Clear Skin, Clear Confidence': 'Piel Clara, Confianza Clara',
      'Restore Your Hair\'s Natural Vitality': 'Restaura la Vitalidad Natural de tu Cabello',
      'Soft, Natural Gradient Brows': 'Cejas Degradadas Suaves y Naturales',
      'Hair-Like Strokes for Natural Brows': 'Trazos como Pelo para Cejas Naturales',
      'Ultra-Fine Hair Simulation Technology': 'Tecnología de Simulación de Cabello Ultrafino',
      'Define Your Eyes, Enhance Your Beauty': 'Define tus Ojos, Realza tu Belleza',
      'Beautiful, Youthful Lips Naturally Enhanced': 'Labios Hermosos y Juveniles Mejorados Naturalmente',
      'Restore Your Natural Lip Color': 'Restaura el Color Natural de tus Labios'
    },
    ko: {
      'Elevating Beauty, Simplifying Your Routine': '아름다움을 높이고 일상을 단순화하세요',
      'Clear Skin, Clear Confidence': '깨끗한 피부, 확실한 자신감',
      'Restore Your Hair\'s Natural Vitality': '모발의 자연스러운 활력 회복',
      'Soft, Natural Gradient Brows': '부드럽고 자연스러운 그라데이션 눈썹',
      'Hair-Like Strokes for Natural Brows': '자연스러운 눈썹을 위한 모발 같은 선',
      'Ultra-Fine Hair Simulation Technology': '초미세 모발 시뮬레이션 기술',
      'Define Your Eyes, Enhance Your Beauty': '눈을 정의하고 아름다움을 향상시키세요',
      'Beautiful, Youthful Lips Naturally Enhanced': '자연스럽게 향상된 아름답고 젊은 입술',
      'Restore Your Natural Lip Color': '자연스러운 입술 색상 복원'
    }
  }
};

// Convert each service
servicesData.forEach(service => {
  console.log(`Converting ${service.slug}...`);
  
  const multilingualService = {
    slug: service.slug,
    title: service.title, // Already multilingual
    
    // Convert subtitle to multilingual
    subtitle: {
      en: service.subtitle || '',
      vi: translations.subtitle.vi[service.subtitle] || service.subtitle || '',
      ja: translations.subtitle.ja[service.subtitle] || service.subtitle || '',
      es: translations.subtitle.es[service.subtitle] || service.subtitle || '',
      ko: translations.subtitle.ko[service.subtitle] || service.subtitle || ''
    },
    
    // Note: For production, use proper translation API
    // For now, keeping English for complex content
    introduction: {
      en: service.introduction || '',
      vi: service.introduction || '', // TODO: Translate
      ja: service.introduction || '', // TODO: Translate
      es: service.introduction || '', // TODO: Translate
      ko: service.introduction || ''  // TODO: Translate
    },
    
    // Convert services array
    services: service.services?.map(s => ({
      name: {
        en: s.name || '',
        vi: s.name || '', // TODO: Translate
        ja: s.name || '',
        es: s.name || '',
        ko: s.name || ''
      },
      description: {
        en: s.description || '',
        vi: s.description || '', // TODO: Translate
        ja: s.description || '',
        es: s.description || '',
        ko: s.description || ''
      },
      options: {
        en: s.options || [],
        vi: s.options || [], // TODO: Translate
        ja: s.options || [],
        es: s.options || [],
        ko: s.options || []
      },
      result: {
        en: s.result || '',
        vi: s.result || '', // TODO: Translate
        ja: s.result || '',
        es: s.result || '',
        ko: s.result || ''
      }
    })) || [],
    
    whyChooseUs: {
      en: service.whyChooseUs || [],
      vi: service.whyChooseUs || [], // TODO: Translate
      ja: service.whyChooseUs || [],
      es: service.whyChooseUs || [],
      ko: service.whyChooseUs || []
    },
    
    closing: {
      en: service.closing || '',
      vi: service.closing || '', // TODO: Translate
      ja: service.closing || '',
      es: service.closing || '',
      ko: service.closing || ''
    },
    
    callToAction: {
      en: service.callToAction || '',
      vi: service.callToAction || '', // TODO: Translate
      ja: service.callToAction || '',
      es: service.callToAction || '',
      ko: service.callToAction || ''
    },
    
    description: service.description, // Already multilingual
    image: service.image,
    technologies: service.technologies || []
  };
  
  // Write to individual file
  const filePath = path.join(servicesDir, `${service.slug}.json`);
  fs.writeFileSync(filePath, JSON.stringify(multilingualService, null, 2));
  console.log(`✅ Created: ${filePath}`);
});

console.log('\n🎉 Conversion complete! Created ' + servicesData.length + ' service files.');
console.log('\n⚠️  NOTE: English content is currently used for all languages.');
console.log('   Please translate the content for vi, ja, es, ko languages.');
