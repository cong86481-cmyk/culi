export type Role = 'ADMIN' | 'CUSTOMER'
export type AccountStatus = 'AVAILABLE' | 'SOLD'
export type DepositStatus = 'PENDING' | 'APPROVED' | 'REJECTED'
export type TransactionType = 'DEPOSIT' | 'PURCHASE' | 'REFUND'

export interface User {
  id: string
  username: string
  email: string
  role: Role
  balance: number
  transferNote?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Account {
  id: string
  title: string
  price: number
  rank: string
  vipLevel: number
  vipGuns: number
  legendaryGuns: number
  skins: number
  characters: string[] | string
  backpack: string[] | string
  description: string
  thumbnail?: string | null
  images: string[] | string
  username: string
  password: string
  status: AccountStatus | string
  featured: boolean
  soldCount: number
  categoryId?: string | null
  category?: Category | null
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
}

export interface Deposit {
  id: string
  userId: string
  user?: User
  amount: number
  method: string
  transferNote: string
  status: DepositStatus
  createdAt: Date
  updatedAt: Date
}

export interface Purchase {
  id: string
  userId: string
  user?: User
  accountId: string
  account?: Account
  price: number
  createdAt: Date
}

export interface Transaction {
  id: string
  userId: string
  user?: User
  type: TransactionType
  amount: number
  description: string
  createdAt: Date
}

export interface Setting {
  id: string
  key: string
  value: string
}

export interface Banner {
  id: string
  title: string
  subtitle?: string | null
  image: string
  link?: string | null
  order: number
  active: boolean
  createdAt: Date
}

export interface ApiResponse<T = unknown> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface AccountFilters {
  search?: string
  category?: string
  rank?: string
  minPrice?: number
  maxPrice?: number
  minVip?: number
  sortBy?: 'newest' | 'cheapest' | 'expensive' | 'vip'
  status?: AccountStatus
}

export interface DashboardStats {
  totalUsers: number
  totalRevenue: number
  totalSoldAccounts: number
  totalAvailableAccounts: number
  pendingDeposits: number
  recentPurchases: Purchase[]
  recentDeposits: Deposit[]
}
