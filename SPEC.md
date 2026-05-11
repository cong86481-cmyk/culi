# CrossFire Legends Vietnam Marketplace - SPEC.md

## 1. Concept & Vision

A premium Vietnamese gaming marketplace for trading CrossFire Legends accounts. The platform combines the intensity of FPS gaming aesthetics with a sleek, modern Vietnamese gaming culture feel. Dark backgrounds with vibrant orange/red neon accents create an immersive, professional marketplace experience that feels like stepping into a high-end gaming portal.

## 2. Design Language

### Aesthetic Direction
- **Reference**: Valorant/PUBG mobile marketplace meets premium Vietnamese gaming shop
- **Mood**: Intense, premium, trustworthy, modern
- **Visual metaphor**: A neon-lit gaming arena marketplace

### Color Palette
- **Primary**: `#FF6B00` (Vibrant Orange)
- **Primary Light**: `#FF8C3A`
- **Primary Dark**: `#CC5500`
- **Secondary**: `#DC2626` (Crimson Red)
- **Accent**: `#FF3D00` (Neon Orange)
- **Background Primary**: `#0A0A0F` (Deep Black)
- **Background Secondary**: `#111118` (Dark Navy)
- **Background Card**: `#1A1A24` (Card Black)
- **Surface**: `#252532` (Surface Gray)
- **Border**: `#2D2D3A` (Border Gray)
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `#A1A1AA`
- **Text Muted**: `#71717A`
- **Success**: `#10B981`
- **Warning**: `#F59E0B`
- **Error**: `#EF4444`

### Typography
- **Primary Font**: Be Vietnam Pro (Google Fonts)
- **Fallback**: Inter, system-ui, sans-serif
- **Headings**: Bold 700, Semi-Bold 600
- **Body**: Regular 400, Medium 500
- **Scale**: 12px, 14px, 16px, 18px, 20px, 24px, 30px, 36px, 48px, 60px

### Spatial System
- **Base unit**: 4px
- **Spacing scale**: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px
- **Border radius**: sm(6px), md(8px), lg(12px), xl(16px), 2xl(20px), 3xl(24px), full(9999px)
- **Card padding**: 20-24px
- **Section padding**: 64-96px vertical

### Motion Philosophy
- **Entrance animations**: Fade up + scale (0.95 → 1), 400ms ease-out
- **Hover effects**: Scale 1.02-1.05, glow intensification, 200ms
- **Page transitions**: Fade 300ms
- **Micro-interactions**: Bounce on click, pulse on notification
- **Stagger delays**: 50-100ms between items
- **Loading**: Skeleton shimmer with orange gradient

### Visual Assets
- **Icons**: Lucide React icons
- **Images**: Local storage in /public/uploads
- **Decorative**: Gradient overlays, glow effects, glassmorphism panels

## 3. Layout & Structure

### Page Structure
```
├── Header (sticky, glassmorphism)
│   ├── Logo
│   ├── Navigation Links
│   ├── Search Bar
│   ├── Wallet Balance
│   └── User Menu
├── Main Content
│   ├── Hero Section (full-width)
│   ├── Featured Content
│   ├── Grid Layouts
│   └── Sections
├── Footer (dark, comprehensive)
```

### Page Routes
```
/                     → Homepage
/marketplace          → Account listing with filters
/account/[id]         → Account detail page
/auth/login           → Login page
/auth/register        → Register page
/dashboard            → User dashboard
/dashboard/purchases  → Purchased accounts
/dashboard/deposits   → Deposit history
/wallet               → Wallet & deposit page
/admin                → Admin dashboard
/admin/accounts       → Account management (CRUD)
/admin/users          → User management
/admin/deposits       → Deposit approvals
/admin/settings       → Website settings
```

### Responsive Breakpoints
- **Mobile**: < 640px (single column, stacked)
- **Tablet**: 640px - 1024px (2 columns)
- **Desktop**: > 1024px (3-4 columns)

## 4. Features & Interactions

### Authentication System
- **Register**: Username, email, password with validation
- **Login**: Email/password with remember me option
- **Session**: JWT tokens stored in httpOnly cookies
- **Roles**: Admin (full access), Customer (limited)
- **Protected routes**: Middleware checks

### Marketplace Features
- **Account Cards**: Thumbnail, title, price, rank badge, VIP level, weapon count
- **Hover Effect**: Card lifts, orange glow, quick view button appears
- **Filters**: Rank, VIP level, price range, weapon count
- **Sort**: Newest, Price (low/high), VIP level
- **Pagination**: 12 items per page
- **Search**: Real-time search with debounce

### Auto Buy System
- **Purchase Flow**:
  1. Click "Mua Ngay" button
  2. Confirm modal appears
  3. Check wallet balance
  4. If sufficient: deduct balance, mark sold, show success
  5. If insufficient: show top-up prompt
- **Delivery**: Account info displayed in modal, copy buttons
- **History**: Saved in purchase history

### Wallet System
- **Balance Display**: Prominent in header and wallet page
- **Deposit Methods**: Bank transfer, VietQR, MoMo
- **Transfer Note**: Auto-generated unique code per user
- **Confirmation**: Admin approves deposits manually
- **History**: All transactions logged

### Admin Features
- **Dashboard**: Stats cards, charts, recent activity
- **Account CRUD**: Full editor with image upload
- **User Management**: View users, adjust balances
- **Deposit Approval**: Approve/reject deposits
- **Settings**: Edit all website content

## 5. Component Inventory

### Navigation Components
- **Navbar**: Glassmorphism, sticky, responsive hamburger menu
- **Footer**: Dark, multi-column, social links
- **Breadcrumb**: For nested pages

### Card Components
- **AccountCard**: Image, title, price, badges, hover glow
- **StatCard**: Icon, number, label, trend indicator
- **TransactionCard**: Type icon, amount, date, status

### Form Components
- **Input**: Dark background, orange focus border, label
- **Select**: Custom styled dropdown
- **Button**: Primary (orange gradient), Secondary (outline), Ghost
- **FileUpload**: Drag & drop zone with preview
- **Toggle**: For boolean settings

### Feedback Components
- **Toast**: Success/error/warning notifications
- **Modal**: Centered, backdrop blur, close button
- **Skeleton**: Shimmer loading placeholders
- **EmptyState**: Illustration + message + action
- **Badge**: Status indicators (available, sold, VIP, etc.)

### UI Elements
- **Avatar**: User profile image
- **Dropdown**: User menu, filter menus
- **Tabs**: For switching views
- **Pagination**: Page numbers with prev/next
- **SearchBar**: With icon, clear button

## 6. Technical Approach

### Stack
- **Framework**: Next.js 14 App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom config
- **Animation**: Framer Motion
- **Database**: SQLite with Prisma ORM
- **Auth**: Custom JWT + cookie session

### Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  username      String    @unique
  email         String    @unique
  password      String
  role          Role      @default(CUSTOMER)
  balance       Float     @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deposits      Deposit[]
  purchases     Purchase[]
  transactions  Transaction[]
}

enum Role {
  ADMIN
  CUSTOMER
}

model Account {
  id             String   @id @default(cuid())
  title          String
  price          Float
  rank           String
  vipLevel       Int      @default(0)
  vipGuns        Int      @default(0)
  legendaryGuns  Int      @default(0)
  skins          Int      @default(0)
  characters     String   @default("[]")
  backpack       String   @default("[]")
  description    String
  thumbnail      String?
  images         String   @default("[]")
  username       String
  password       String
  status         AccountStatus @default(AVAILABLE)
  featured       Boolean  @default(false)
  categoryId     String?
  category       Category? @relation(fields: [categoryId], references: [id])
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  purchases      Purchase[]
}

enum AccountStatus {
  AVAILABLE
  SOLD
}

model Category {
  id          String    @id @default(cuid())
  name        String    @unique
  slug        String    @unique
  accounts    Account[]
}

model Deposit {
  id          String        @id @default(cuid())
  userId      String
  user        User          @relation(fields: [userId], references: [id])
  amount      Float
  method      String
  transferNote String
  status      DepositStatus @default(PENDING)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

enum DepositStatus {
  PENDING
  APPROVED
  REJECTED
}

model Purchase {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  accountId   String
  account     Account  @relation(fields: [accountId], references: [id])
  price       Float
  createdAt   DateTime @default(now())
}

model Transaction {
  id          String          @id @default(cuid())
  userId      String
  user        User            @relation(fields: [userId], references: [id])
  type        TransactionType
  amount      Float
  description String
  createdAt   DateTime        @default(now())
}

enum TransactionType {
  DEPOSIT
  PURCHASE
  REFUND
}

model Setting {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String
}
```

### API Routes

```
POST   /api/auth/register     → Create user
POST   /api/auth/login         → Login user
POST   /api/auth/logout        → Logout user
GET    /api/auth/me            → Get current user

GET    /api/accounts           → List accounts (with filters)
GET    /api/accounts/[id]      → Get account detail
POST   /api/accounts           → Create account (admin)
PUT    /api/accounts/[id]      → Update account (admin)
DELETE /api/accounts/[id]      → Delete account (admin)

GET    /api/categories         → List categories

POST   /api/wallet/deposit     → Request deposit
POST   /api/wallet/approve     → Approve deposit (admin)
GET    /api/wallet/history     → Transaction history

POST   /api/purchase/[id]      → Buy account
GET    /api/purchases          → User purchases

GET    /api/admin/stats        → Dashboard stats
GET    /api/admin/users        → List users (admin)
PUT    /api/admin/users/[id]   → Update user (admin)
GET    /api/admin/deposits      → List deposits (admin)
PUT    /api/admin/settings     → Update settings (admin)
```

### File Structure
```
/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── uploads/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── marketplace/
│   │   │   └── [id]/
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   ├── purchases/
│   │   │   └── deposits/
│   │   ├── wallet/
│   │   ├── admin/
│   │   │   ├── page.tsx
│   │   │   ├── accounts/
│   │   │   ├── users/
│   │   │   ├── deposits/
│   │   │   └── settings/
│   └── api/
│       ├── auth/
│       ├── accounts/
│       ├── wallet/
│       ├── purchase/
│       └── admin/
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── marketplace/
│   │   ├── admin/
│   │   └── auth/
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   └── types/
│       └── index.ts
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```
