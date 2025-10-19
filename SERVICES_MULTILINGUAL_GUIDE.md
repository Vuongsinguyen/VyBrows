# Hướng dẫn Update Services.json với Đa Ngôn Ngữ

## ⚠️ LƯU Ý QUAN TRỌNG

File services.json hiện tại có **637 dòng** và cần được cập nhật hoàn toàn.

## 🎯 Mục tiêu SEO

1. ✅ Mỗi service có đầy đủ 5 ngôn ngữ: en, vi, ja, es, ko
2. ✅ Tất cả field quan trọng đều được dịch: subtitle, introduction, services, whyChooseUs, closing, callToAction
3. ✅ Tránh duplicate content
4. ✅ Cải thiện user experience và local SEO

## 📝 Cấu trúc Mới

Thay vì:
```json
"subtitle": "Clear Skin, Clear Confidence"
```

Sẽ là:
```json
"subtitle": {
  "en": "Clear Skin, Clear Confidence",
  "vi": "Da Sạch, Tự Tin Rạng Rỡ",
  "ja": "クリアな肌、クリアな自信",
  "es": "Piel Clara, Confianza Clara",
  "ko": "맑은 피부, 맑은 자신감"
}
```

## 🚀 Action Plan

Do file quá lớn, tôi đề xuất:

### Option A: Tạo file mới hoàn chỉnh (RECOMMENDED)
- ✅ Tạo `services-new.json` với cấu trúc hoàn chỉnh
- ✅ Test với 1-2 services trước
- ✅ Verify không có lỗi
- ✅ Replace file cũ

### Option B: Từng bước update
- 1️⃣ Update 3 services đầu (PMU, Skincare, Detox)
- 2️⃣ Update 3 services giữa (Shading, Microblading, Hair Strokes)
- 3️⃣ Update 3 services cuối (Eyeliner, Lip Treatments, Dark Lips)

## 📊 Timeline Ước Tính

- **Tạo cấu trúc mới:** 5 phút
- **Dịch nội dung:** 10-15 phút (với AI assistance)
- **Update template code:** 5 phút
- **Test & verify:** 5 phút
- **TOTAL:** ~25-30 phút

## 🛠️ Template Code Changes Needed

File: `/src/pages/[lang]/service/[service].astro`

### Current Code:
```javascript
currentService?.subtitle
```

### New Code:
```javascript
currentService?.subtitle?.[lang] || currentService?.subtitle?.en
```

Áp dụng cho tất cả các field: subtitle, introduction, closing, callToAction

## ⚡ Quick Start

Bạn muốn tôi:
1. **Tạo services-new.json ngay** và test với 1 service trước?
2. **Hay làm từng bước** update từng nhóm services?

Chọn số 1 hoặc 2 để tiếp tục!
