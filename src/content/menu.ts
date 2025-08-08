// src/content/menu.ts
// Centralized menu config for all languages

export interface MenuItem {
  label: string;
  href: string;
  title: string;
  description: string;
  children?: MenuItem[];
}

export const menus: Record<string, MenuItem[]> = {
  en: [
    { label: 'Home', href: '/en/', title: 'Home', description: 'Go to homepage' },
    {
      label: 'About Us', href: '/en/about-us', title: 'About Us', description: 'Learn about ARIS Vietnam',
      children: [
        { href: '/en/about-us#overview', label: 'Overview', title: 'Overview', description: 'Overview' },
        { href: '/en/about-us#ceo-message', label: 'CEO Message', title: 'CEO Message', description: 'CEO Message' },
        { href: '/en/about-us#vision-mission', label: 'Vision & Mission', title: 'Vision & Mission', description: 'Vision & Mission' },
        { href: '/en/about-us#profile', label: 'Profile', title: 'Profile', description: 'Profile' },
        { href: '/en/about-us#timeline', label: 'Timeline', title: 'Timeline', description: 'Timeline' },
        { href: '/en/about-us#why-choose-us', label: 'Why Choose Us?', title: 'Why Choose Us?', description: 'Why Choose Us?' },
        { href: '/en/about-us#our-customer', label: 'Our Customer', title: 'Our Customer', description: 'Our Customer' },
        { href: '/en/about-us#skills', label: 'Skill & Abilities', title: 'Skill & Abilities', description: 'Skill & Abilities' },
        { href: '/en/about-us#technologies', label: 'Technologies', title: 'Technologies', description: 'Technologies' },
        { href: '/en/about-us#project-flow', label: 'Project Flow', title: 'Project Flow', description: 'Project Flow' },
        { href: '/en/about-us#team-structure', label: 'Project Team Structure', title: 'Project Team Structure', description: 'Project Team Structure' },
        { href: '/en/about-us#sustainability', label: 'Sustainability', title: 'Sustainability', description: 'Sustainability' },
        { href: '/en/about-us#community', label: 'Community Connect', title: 'Community Connect', description: 'Community Connect' }
      ]
    },
    {
      label: 'Projects',
      href: '/en/projects',
      title: 'Projects',
      description: 'Our project portfolio',
      children: [
        { href: '/en/projects/project-001/ai-chatbot', label: 'AI Chatbot', title: 'AI Chatbot', description: 'AI Chatbot' },
        { href: '/en/projects/project-002/e-commerce-platform', label: 'E-Commerce Platform', title: 'E-Commerce Platform', description: 'E-Commerce Platform' },
        { href: '/en/projects/project-003/iot-dashboard', label: 'IoT Dashboard', title: 'IoT Dashboard', description: 'IoT Dashboard' },
        { href: '/en/projects/project-004/mobile-banking-app', label: 'Mobile Banking App', title: 'Mobile Banking App', description: 'Mobile Banking App' },
        { href: '/en/projects/project-005/portfolio-website', label: 'Portfolio Website', title: 'Portfolio Website', description: 'Portfolio Website' },
        { href: '/en/projects/project-006/project-001', label: 'Project 001', title: 'Project 001', description: 'Project 001' },
        { href: '/en/projects/project-007/project-002', label: 'Project 002', title: 'Project 002', description: 'Project 002' },
        { href: '/en/projects/project-008/project-003', label: 'Project 003', title: 'Project 003', description: 'Project 003' }
      ]
    },
    {
      label: 'Services', href: '/en/#services', title: 'Services', description: 'Our services',
      children: [
        { href: '/en/service/web-development', title: 'Web Development', description: 'Modern and responsive websites', label: 'Web Development' },
        { href: '/en/service/mobile-app', title: 'Mobile Apps', description: 'Professional iOS and Android apps', label: 'Mobile Apps' },
        { href: '/en/service/design', title: 'UI/UX Design', description: 'Beautiful and user-friendly interfaces', label: 'UI/UX Design' },
        { href: '/en/service/consulting', title: 'IT Consulting', description: 'Comprehensive technology solutions', label: 'IT Consulting' },
        { href: '/en/service/ai', title: 'AI Solutions', description: 'Artificial Intelligence and Machine Learning', label: 'AI Solutions' },
        { href: '/en/service/iot', title: 'IoT Solutions', description: 'Internet of Things and smart devices', label: 'IoT Solutions' },
        { href: '/en/service/cloud', title: 'Cloud Services', description: 'Cloud migration and management', label: 'Cloud Services' },
        { href: '/en/service/testing', title: 'Testing & QA', description: 'Quality assurance and software testing', label: 'Testing & QA' },
        { href: '/en/service/maintenance', title: 'Maintenance & Support', description: 'Ongoing support and maintenance', label: 'Maintenance & Support' }
      ]
    },
    { label: 'News', href: '/en/news', title: 'News', description: 'Latest news and updates' },
    { label: 'Contact', href: '/en/#contact', title: 'Contact', description: 'Contact us' }
  ],
  vi: [
    { label: 'Trang chủ', href: '/vi/', title: 'Trang chủ', description: 'Về trang chủ' },
    {
      label: 'Về chúng tôi', href: '/vi/about-us', title: 'Về chúng tôi', description: 'Giới thiệu về ARIS Vietnam',
      children: [
        { href: '/vi/about-us#overview', label: 'Tổng quan', title: 'Tổng quan', description: 'Tổng quan' },
        { href: '/vi/about-us#ceo-message', label: 'Thông điệp CEO', title: 'Thông điệp CEO', description: 'Thông điệp CEO' },
        { href: '/vi/about-us#vision-mission', label: 'Tầm nhìn & Sứ mệnh', title: 'Tầm nhìn & Sứ mệnh', description: 'Tầm nhìn & Sứ mệnh' },
        { href: '/vi/about-us#profile', label: 'Hồ sơ công ty', title: 'Hồ sơ công ty', description: 'Hồ sơ công ty' },
        { href: '/vi/about-us#timeline', label: 'Dấu mốc phát triển', title: 'Dấu mốc phát triển', description: 'Dấu mốc phát triển' },
        { href: '/vi/about-us#why-choose-us', label: 'Tại sao chọn chúng tôi?', title: 'Tại sao chọn chúng tôi?', description: 'Tại sao chọn chúng tôi?' },
        { href: '/vi/about-us#our-customer', label: 'Khách hàng', title: 'Khách hàng', description: 'Khách hàng' },
        { href: '/vi/about-us#skills', label: 'Kỹ năng & Năng lực', title: 'Kỹ năng & Năng lực', description: 'Kỹ năng & Năng lực' },
        { href: '/vi/about-us#technologies', label: 'Công nghệ', title: 'Công nghệ', description: 'Công nghệ' },
        { href: '/vi/about-us#project-flow', label: 'Quy trình dự án', title: 'Quy trình dự án', description: 'Quy trình dự án' },
        { href: '/vi/about-us#team-structure', label: 'Cơ cấu dự án', title: 'Cơ cấu dự án', description: 'Cơ cấu dự án' },
        { href: '/vi/about-us#sustainability', label: 'Phát triển bền vững', title: 'Phát triển bền vững', description: 'Phát triển bền vững' },
        { href: '/vi/about-us#community', label: 'Kết nối cộng đồng', title: 'Kết nối cộng đồng', description: 'Kết nối cộng đồng' }
      ]
    },
    { label: 'Dự án', href: '/vi/projects', title: 'Dự án', description: 'Danh mục dự án' },
    {
      label: 'Dịch vụ', href: '/vi/#services', title: 'Dịch vụ', description: 'Các dịch vụ của chúng tôi',
      children: [
        { href: '/vi/service/web-development', title: 'Phát triển Web', description: 'Trang web hiện đại và responsive', label: 'Phát triển Web' },
        { href: '/vi/service/mobile-app', title: 'Ứng dụng Mobile', description: 'App iOS và Android chuyên nghiệp', label: 'Ứng dụng Mobile' },
        { href: '/vi/service/design', title: 'Thiết kế UI/UX', description: 'Giao diện đẹp và dễ sử dụng', label: 'Thiết kế UI/UX' },
        { href: '/vi/service/consulting', title: 'Tư vấn IT', description: 'Giải pháp công nghệ toàn diện', label: 'Tư vấn IT' },
        { href: '/vi/service/ai', title: 'Giải pháp AI', description: 'Trí tuệ nhân tạo và máy học', label: 'Giải pháp AI' },
        { href: '/vi/service/iot', title: 'Giải pháp IoT', description: 'Internet vạn vật và thiết bị thông minh', label: 'Giải pháp IoT' },
        { href: '/vi/service/cloud', title: 'Dịch vụ Cloud', description: 'Di chuyển và quản lý đám mây', label: 'Dịch vụ Cloud' },
        { href: '/vi/service/testing', title: 'Kiểm thử & QA', description: 'Đảm bảo chất lượng và kiểm thử phần mềm', label: 'Kiểm thử & QA' },
        { href: '/vi/service/maintenance', title: 'Bảo trì & Hỗ trợ', description: 'Hỗ trợ và bảo trì liên tục', label: 'Bảo trì & Hỗ trợ' }
      ]
    },
    { label: 'Tin tức', href: '/vi/news', title: 'Tin tức', description: 'Tin tức và cập nhật mới' },
    { label: 'Liên hệ', href: '/vi/#contact', title: 'Liên hệ', description: 'Liên hệ với chúng tôi' }
  ],
  ja: [
    { label: 'ホーム', href: '/ja/', title: 'ホーム', description: 'ホームページへ' },
    {
      label: '会社概要', href: '/ja/about-us', title: '会社概要', description: 'ARIS Vietnamについて',
      children: [
        { href: '/ja/about-us#overview', label: '概要', title: '概要', description: '概要' },
        { href: '/ja/about-us#ceo-message', label: 'CEOメッセージ', title: 'CEOメッセージ', description: 'CEOメッセージ' },
        { href: '/ja/about-us#vision-mission', label: 'ビジョン＆ミッション', title: 'ビジョン＆ミッション', description: 'ビジョン＆ミッション' },
        { href: '/ja/about-us#profile', label: '会社概要', title: '会社概要', description: '会社概要' },
        { href: '/ja/about-us#timeline', label: '沿革', title: '沿革', description: '沿革' },
        { href: '/ja/about-us#why-choose-us', label: '選ばれる理由', title: '選ばれる理由', description: '選ばれる理由' },
        { href: '/ja/about-us#our-customer', label: '顧客', title: '顧客', description: '顧客' },
        { href: '/ja/about-us#skills', label: 'スキル・能力', title: 'スキル・能力', description: 'スキル・能力' },
        { href: '/ja/about-us#technologies', label: '技術', title: '技術', description: '技術' },
        { href: '/ja/about-us#project-flow', label: 'プロジェクトフロー', title: 'プロジェクトフロー', description: 'プロジェクトフロー' },
        { href: '/ja/about-us#team-structure', label: 'プロジェクト体制', title: 'プロジェクト体制', description: 'プロジェクト体制' },
        { href: '/ja/about-us#sustainability', label: 'サステナビリティ', title: 'サステナビリティ', description: 'サステナビリティ' },
        { href: '/ja/about-us#community', label: 'コミュニティ連携', title: 'コミュニティ連携', description: 'コミュニティ連携' }
      ]
    },
    { label: 'プロジェクト', href: '/ja/projects', title: 'プロジェクト', description: 'プロジェクト一覧' },
    {
      label: 'サービス', href: '/ja/#services', title: 'サービス', description: '当社のサービス',
      children: [
        { href: '/ja/service/web-development', title: 'Webサイト開発', description: 'モダンでレスポンシブなウェブサイト', label: 'Webサイト開発' },
        { href: '/ja/service/mobile-app', title: 'モバイルアプリ', description: 'プロフェッショナルなiOS・Androidアプリ', label: 'モバイルアプリ' },
        { href: '/ja/service/design', title: 'UI/UXデザイン', description: '美しく使いやすいインターフェース', label: 'UI/UXデザイン' },
        { href: '/ja/service/consulting', title: 'ITコンサルティング', description: '包括的な技術ソリューション', label: 'ITコンサルティング' },
        { href: '/ja/service/ai', title: 'AIソリューション', description: '人工知能・機械学習', label: 'AIソリューション' },
        { href: '/ja/service/iot', title: 'IoTソリューション', description: 'IoT・スマートデバイス', label: 'IoTソリューション' },
        { href: '/ja/service/cloud', title: 'クラウドサービス', description: 'クラウド移行・管理', label: 'クラウドサービス' },
        { href: '/ja/service/testing', title: 'テスト・QA', description: '品質保証・ソフトウェアテスト', label: 'テスト・QA' },
        { href: '/ja/service/maintenance', title: '保守・サポート', description: '継続的なサポート・保守', label: '保守・サポート' }
      ]
    },
    { label: 'ニュース', href: '/ja/news', title: 'ニュース', description: '最新ニュースと更新情報' },
    { label: 'お問い合わせ', href: '/ja/#contact', title: 'お問い合わせ', description: 'お問い合わせはこちら' }
  ]
};
