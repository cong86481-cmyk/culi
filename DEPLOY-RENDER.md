# Hướng Dẫn Deploy lên Render - Chi Tiết

## PHẦN 1: Chuẩn Bị (Trên Máy Tính)

### 1.1. Cài Git (nếu chưa có)
```bash
git --version
```
Nếu báo lỗi → Tải Git: https://git-scm.com/download/win

### 1.2. Kiểm tra các file đã sẵn sàng
Đảm bảo có 2 file này trong project:
- `render.yaml`
- `prisma/schema.prisma` (đã đổi sang postgresql)

---

## PHẦN 2: Tạo GitHub Repository

### 2.1. Tạo repo trên GitHub
1. Mở https://github.com
2. Đăng nhập → Click **"+"** góc trên phải → **"New repository"**
3. Điền:
   - Repository name: `cfl-marketplace`
   - Description: `CrossFire Legends Vietnam Account Marketplace`
   - Public hoặc Private đều được
4. Click **"Create repository"**

### 2.2. Push code lên GitHub
Mở Terminal (PowerShell hoặc CMD) trong thư mục project:

```bash
# Di chuyển vào thư mục project
cd "c:\cfl culi"

# Khởi tạo Git (nếu chưa có)
git init

# Thêm tất cả file
git add .

# Tạo commit đầu tiên
git commit -m "first commit - deploy to render"

# Đổi tên branch thành main
git branch -M main

# Thêm remote (thay YOUR_USERNAME bằng username GitHub của bạn)
git remote add origin https://github.com/YOUR_USERNAME/cfl-marketplace.git

# Push lên GitHub
git push -u origin main
```

### 2.3. Xác nhận thành công
- Refresh trang GitHub repo
- Thấy code hiển thị = thành công

---

## PHẦN 3: Deploy trên Render

### 3.1. Tạo tài khoản Render
1. Mở https://render.com
2. Click **"Get Started"**
3. Đăng nhập bằng **GitHub** (nhanh nhất)

### 3.2. Tạo PostgreSQL Database

1. Dashboard → Click **"New +"** → **"PostgreSQL"**

2. Điền thông tin:
   - **Name**: `cfl-marketplace-db`
   - **Database**: `cfl_marketplace_db`
   - **User**: (để mặc định)
   - **Region**: **Singapore** (gần VN, nhanh hơn)
   - **Plan**: **Free**

3. Click **"Create Database"**

4. Đợi ~1-2 phút cho database được tạo

5. **Copy Connection String**:
   - Trong trang database vừa tạo
   - Tìm section **"Connection Details"**
   - Click **"Copy"** bên cạnh **Connection string**
   - Format: `postgres://user:password@host:5432/database`

### 3.3. Tạo Web Service

1. Dashboard → Click **"New +"** → **"Web Service"**

2. Connect GitHub:
   - Tìm repo `cfl-marketplace`
   - Click **"Connect"**

3. Cấu hình Web Service:

   | Field | Value |
   |-------|-------|
   | **Name** | `cfl-marketplace` |
   | **Region** | Singapore |
   | **Branch** | main |
   | **Runtime** | Node |
   | **Root Directory** | (để trống) |
   | **Build Command** | `npm install && npx prisma generate && npm run build` |
   | **Start Command** | `npm start` |
   | **Plan** | Free |

4. **Environment Variables** - Click **"Add Environment Variable"**:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `DATABASE_URL` | Paste connection string đã copy ở bước 3.2 |
   | `JWT_SECRET` | Click **"Generate"** để tạo ngẫu nhiên |

5. Click **"Create Web Service"**

6. Đợi build (~3-5 phút lần đầu)

### 3.4. Xem logs build
- Click vào Web Service → tab **"Logs"**
- Nếu thấy màu xanh "Deployed" = thành công
- Nếu lỗi màu đỏ → xem lỗi ở PHẦN 4

---

## PHẦN 4: Khởi Tạo Database (Sau Khi Deploy)

### 4.1. SSH vào Web Service
1. Trong Web Service → Click **"Shell"**
2. Hoặc dùng terminal local với Render CLI

### 4.2. Chạy lệnh tạo bảng
```bash
npx prisma db push
```

### 4.3. (Tùy chọn) Tạo dữ liệu mẫu
```bash
npm run db:seed
```

---

## PHẦN 5: Truy Cập Website

1. Trong Web Service → Copy URL
2. Format: `https://cfl-marketplace.onrender.com`
3. Mở trình duyệt → truy cập

---

## PHẦN 6: Xử Lý Lỗi Thường Gặp

### Lỗi: "Could not connect to database"
- Kiểm tra `DATABASE_URL` đã đúng chưa
- Kiểm tra PostgreSQL đang chạy (không bị sleep)

### Lỗi: "Build failed"
- Xem logs chi tiết trong tab "Logs"
- Thường do thiếu dependency hoặc lỗi code

### Lỗi: "Connection timeout"
- Free tier sleep sau 15 phút không dùng
- Lần đầu truy cập có thể chậm ~30 giây (wake up)

### Database reset?
- Free tier PostgreSQL không bị reset tự động
- Disk của Web Service bị reset khi sleep (nhưng ta dùng PostgreSQL nên OK)

---

## Tóm Tắt Nhanh

```
1. Tạo GitHub repo → Push code
2. Tạo PostgreSQL trên Render → Copy DATABASE_URL
3. Tạo Web Service trên Render → Paste DATABASE_URL
4. SSH → chạy npx prisma db push
5. Xong! Truy cập website
```

---

## Sau Khi Deploy Thành Công

### Cập nhật code mới:
```bash
# Sửa code trên máy
git add .
git commit -m "update something"
git push
```
→ Render tự động deploy lại

### Xem website:
- Link: `https://cfl-marketplace.onrender.com` (hoặc tên bạn đặt)
