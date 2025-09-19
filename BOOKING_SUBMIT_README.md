# VyBrows Booking System - Submit Feature

## 🎯 Tổng quan tính năng

Hệ thống booking đã được nâng cấp với tính năng submit hoàn chỉnh:
- ✅ **Gửi email cho Admin** khi có booking mới
- ✅ **Gửi email xác nhận cho User** sau khi submit
- ✅ **Ghi dữ liệu lên Google Sheets** để quản lý
- ✅ **Validation đầy đủ** cho tất cả các bước
- ✅ **UI feedback** với loading states và success/error messages

## 🚀 Cách sử dụng

### 1. Setup Environment Variables

Trong Netlify Dashboard, thêm các biến môi trường:

```env
# Email settings (đã có sẵn)
ZOHO_USER=your-email@vybrows-academy.com
ZOHO_PASS=your-app-password
ZOHO_SMTP_HOST=smtppro.zoho.com
ADMIN_EMAIL=vybrowsk@gmail.com

# Google Sheets (tùy chọn - xem GOOGLE_SHEETS_SETUP.md)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----"
GOOGLE_SHEET_ID=your-google-sheet-id-here
```

### 2. Quy trình Submit

1. **User điền thông tin booking** qua 4 bước:
   - Chọn Category (PMU/Skincare/Detox)
   - Chọn Service và Option
   - Chọn Date & Time
   - Điền thông tin cá nhân

2. **Click "Confirm & Book"** để submit

3. **Hệ thống sẽ:**
   - Validate tất cả thông tin
   - Gửi email cho Admin với chi tiết booking
   - Gửi email xác nhận cho User
   - Ghi dữ liệu lên Google Sheets (nếu đã setup)
   - Hiển thị thông báo thành công

## 📧 Email Templates

### Email cho Admin:
```
Subject: New Booking: [Service] - [Customer Name]

Chào Admin,

Có booking mới từ website:

• Category: PMU/Skincare/Detox
• Service: Tên dịch vụ
• Option: Lựa chọn của khách
• Date: Ngày đặt
• Time: Giờ đặt
• Name: Tên khách
• Phone: Số điện thoại
• Email: Email khách
• Notes: Ghi chú thêm

Vui lòng liên hệ khách để xác nhận booking.
```

### Email cho Customer:
```
Subject: Booking Confirmation - VyBrows Academy

Kính chào [Tên khách],

Cảm ơn bạn đã đặt lịch tại VyBrows Academy!

Thông tin booking của bạn:
• Category: PMU/Skincare/Detox
• Service: Tên dịch vụ
• Option: Lựa chọn
• Date: Ngày đặt
• Time: Giờ đặt
• Name: Tên của bạn
• Phone: Số điện thoại
• Email: Email của bạn

Chúng tôi sẽ liên hệ bạn trong vòng 24 giờ để xác nhận booking.

Trân trọng,
VyBrows Academy Team
```

## 📊 Google Sheets Integration

### Cấu trúc dữ liệu:
```
A: Timestamp      - Thời gian submit
B: Category       - PMU/Skincare/Detox
C: Service        - Tên dịch vụ
D: Option         - Lựa chọn của khách
E: Date          - Ngày đặt
F: Time          - Giờ đặt
G: Name          - Tên khách
H: Phone         - Số điện thoại
I: Email         - Email khách
J: Notes         - Ghi chú
K: Status        - Pending/Confirmed/Cancelled
```

### Setup Google Sheets:
Xem file `GOOGLE_SHEETS_SETUP.md` để có hướng dẫn chi tiết.

## 🔧 API Endpoint

### POST `/.netlify/functions/submitBooking`

**Request Body:**
```json
{
  "category": "pmu",
  "service": "Micro Blading",
  "option": "Nano",
  "date": "2025-01-15",
  "time": "14:30",
  "name": "Nguyen Van A",
  "phone": "+84 123 456 789",
  "email": "customer@example.com",
  "notes": "Submitted via website"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking submitted successfully",
  "sheetUpdated": true
}
```

## 🎨 UI Features

### Loading States:
- Button disabled khi đang submit
- Text thay đổi thành "Submitting..."
- User không thể click lại

### Success/Error Messages:
- Thông báo xanh lá khi thành công
- Thông báo đỏ khi có lỗi
- Tự động ẩn sau 3 giây

### Form Reset:
- Sau khi submit thành công, form tự reset
- Quay về step 1
- Clear tất cả dữ liệu đã nhập

## 🐛 Troubleshooting

### Email không gửi được:
- Kiểm tra ZOHO_USER và ZOHO_PASS
- Đảm bảo App Password đúng
- Check SMTP host settings

### Google Sheets không hoạt động:
- Kiểm tra Service Account credentials
- Đảm bảo Sheet ID đúng
- Verify permissions (Editor access)

### Build errors:
- Đảm bảo tất cả dependencies đã cài
- Check TypeScript errors
- Verify Netlify function syntax

## 📝 Logs & Monitoring

### Console Logs:
- Booking data được log khi submit
- Email sending status
- Google Sheets operation results
- Error messages với chi tiết

### Netlify Dashboard:
- Function logs trong Netlify Functions tab
- Error tracking và performance metrics

## 🔄 Future Enhancements

- [ ] **SMS notifications** cho customer
- [ ] **Calendar integration** (Google Calendar)
- [ ] **Payment integration** (Stripe/PayPal)
- [ ] **Booking management dashboard** cho admin
- [ ] **Automated reminders** trước appointment
- [ ] **Customer feedback system**

---

**🎉 Chúc mừng! Hệ thống booking của bạn giờ đã hoàn chỉnh với tính năng submit professional!**