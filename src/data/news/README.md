# News Management System

## Cấu trúc mới

Để dễ quản lý, mỗi bài news giờ đây được lưu trong 1 file JSON riêng biệt:

```
src/data/news/
├── index.json          # Index file chứa danh sách tất cả các bài news
├── 1.json             # Bài news ID 1 (có Facebook video)
├── 2.json             # Bài news ID 2
├── 3.json             # Bài news ID 3
├── 4.json             # Bài news ID 4
└── ...                # Các bài news khác
```

## Cách sử dụng

### 1. Thêm bài news mới

1. **Tạo file JSON mới** với ID tiếp theo (ví dụ: `5.json`):

```json
{
  "id": 5,
  "mainImage": "/images/service05.avif",
  "createdDate": "October 15, 2025",
  "translations": {
    "en": {
      "title": "Your English Title",
      "shortDescription": "Your English description",
      "content": "<p>Your English content with HTML tags</p>"
    },
    "vi": {
      "title": "Tiêu đề tiếng Việt",
      "shortDescription": "Mô tả ngắn tiếng Việt",
      "content": "<p>Nội dung tiếng Việt với HTML</p>"
    }
  }
}
```

2. **Cập nhật file `index.json`**:

```json
{
  "newsIndex": [
    {
      "id": 1,
      "file": "1.json",
      "featured": true
    },
    {
      "id": 2,
      "file": "2.json", 
      "featured": false
    },
    // ... existing entries ...
    {
      "id": 5,
      "file": "5.json",
      "featured": false
    }
  ]
}
```

3. **Cập nhật `newsLoader.js`** để import file mới:

```javascript
import news5 from './news/5.json';

const newsData = {
  1: news1,
  2: news2,
  3: news3,
  4: news4,
  5: news5  // Thêm dòng này
};
```

### 2. Chỉnh sửa bài news

Chỉ cần chỉnh sửa file JSON tương ứng trong thư mục `/src/data/news/`

### 3. Xóa bài news

1. Xóa file JSON tương ứng
2. Xóa entry trong `index.json`
3. Xóa import trong `newsLoader.js`

### 4. Đặt bài news làm Featured

Trong file `index.json`, đặt `"featured": true` cho bài news muốn highlight.

## API Functions

Sử dụng các function trong `newsLoader.js`:

```javascript
import { getAllNews, getNewsById, getFeaturedNews } from '../data/newsLoader.js';

// Lấy tất cả bài news
const allNews = getAllNews();

// Lấy bài news theo ID
const newsItem = getNewsById(1);

// Lấy bài news được featured
const featuredNews = getFeaturedNews();
```

## Lưu ý

- Tất cả các file đều phải có cú pháp JSON hợp lệ
- ID phải là số và duy nhất
- Mỗi bài news phải có đầy đủ translations cho các ngôn ngữ cần thiết
- Khi thêm bài mới, nhớ import trong `newsLoader.js`

## Video Facebook

Để thêm video Facebook vào bài news, sử dụng format:

```html
<div class="video-container" style="margin: 20px 0; text-align: center;">
  <iframe src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2Freel%2FYOUR_VIDEO_ID&show_text=false&width=267&t=0" 
          width="267" height="476" 
          style="border:none;overflow:hidden" 
          scrolling="no" frameborder="0" 
          allowfullscreen="true" 
          allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" 
          allowFullScreen="true">
  </iframe>
</div>
```

Thay `YOUR_VIDEO_ID` bằng ID thực của Facebook Reel/Video.