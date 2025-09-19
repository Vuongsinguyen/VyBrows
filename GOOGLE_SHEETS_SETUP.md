# Google Sheets Setup Guide

## 1. Tạo Google Sheet

1. Truy cập [Google Sheets](https://sheets.google.com)
2. Tạo sheet mới với tên "VyBrows Bookings"
3. Đặt tên sheet đầu tiên là "Bookings"
4. Thêm headers vào dòng đầu tiên:
   ```
   A1: Timestamp
   B1: Category
   C1: Service
   D1: Option
   E1: Date
   F1: Time
   G1: Name
   H1: Phone
   I1: Email
   J1: Notes
   K1: Status
   ```

## 2. Tạo Service Account

1. Truy cập [Google Cloud Console](https://console.cloud.google.com)
2. Tạo project mới hoặc chọn project hiện có
3. Enable Google Sheets API:
   - APIs & Services > Library
   - Tìm "Google Sheets API" và enable
4. Tạo Service Account:
   - IAM & Admin > Service Accounts
   - Create Service Account
   - Đặt tên: "VyBrows Booking Bot"
   - Tạo JSON key và download file

## 3. Chia sẻ Google Sheet với Service Account

1. Mở Google Sheet
2. Click "Share"
3. Paste email từ service account JSON file
4. Đặt quyền "Editor"

## 4. Cấu hình Environment Variables

Trong Netlify Dashboard:

```env
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----"
GOOGLE_SHEET_ID=your-google-sheet-id-here
```

## 5. Cài đặt Dependencies

```bash
npm install googleapis @netlify/functions --save
```

## 6. Cập nhật Function

Trong `netlify/functions/submitBooking.ts`, uncomment phần Google Sheets:

```typescript
import { google } from 'googleapis';

// Uncomment appendToGoogleSheet function
async function appendToGoogleSheet(data: any) {
  // ... existing code
}
```