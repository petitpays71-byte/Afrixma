/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Role = 'visitor' | 'member' | 'seller' | 'instructor' | 'moderator' | 'admin';

export type LanguageCode = 'fr' | 'en' | 'es' | 'pt' | 'de' | 'ar' | 'zh' | 'sw';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar: string;
  role: Role;
  membershipStatus: 'pending_payment' | 'active' | 'suspended';
  registrationDate: string;
  referralCode: string;
  referredBy?: string;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  country: string;
  omAccountNumber?: string;
  momoAccountNumber?: string;
}

export interface CourseLesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  pdfUrl?: string;
  content: string;
  completed?: boolean;
}

export interface CourseModule {
  id: string;
  title: string;
  lessons: CourseLesson[];
}

export interface Course {
  id: string;
  title: string;
  category: 'tech' | 'ai' | 'business' | 'crypto' | 'agritech' | 'marketing';
  instructor: string;
  instructorAvatar: string;
  thumbnail: string;
  description: string;
  price: number; // in FCFA (0 = free)
  isFree: boolean;
  duration: string;
  rating: number;
  enrolledCount: number;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  modules: CourseModule[];
  published: boolean;
}

export interface DigitalBook {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  description: string;
  category: string;
  price: number; // in FCFA (0 = free)
  pageCount: number;
  previewSnippet: string;
  fileSize: string;
  pdfContentUrl: string;
  published: boolean;
  downloadsCount: number;
}

export interface SoftwareApp {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  description: string;
  version: string;
  category: 'productivity' | 'security' | 'developer' | 'ai' | 'utilities';
  price: number; // in FCFA
  downloadUrl: string;
  platforms: ('Android' | 'Windows' | 'macOS' | 'Linux' | 'Web')[];
  licenseType: 'Gratuit' | 'Freemium' | 'Licence AFRIXA';
  screenshots: string[];
  published: boolean;
}

export interface MarketplaceProduct {
  id: string;
  title: string;
  storeId: string;
  storeName: string;
  price: number; // in FCFA
  category: string;
  image: string;
  description: string;
  type: 'digital' | 'physical';
  stock: number;
  rating: number;
  reviewsCount: number;
  digitalDownloadUrl?: string;
  published: boolean;
}

export interface Store {
  id: string;
  ownerId: string;
  name: string;
  logo: string;
  description: string;
  verified: boolean;
  productsCount: number;
  totalSales: number;
  rating: number;
}

export interface CartItem {
  product: MarketplaceProduct;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number; // FCFA
  paymentReference: string;
  paymentMethod: 'orange_money' | 'mtn_momo' | 'wallet';
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  deliveryType: 'digital_instant' | 'physical_shipping';
  shippingAddress?: string;
}

export interface PaymentTransaction {
  id: string;
  reference: string;
  userId: string;
  userName: string;
  amount: number; // in FCFA
  currency: 'FCFA';
  method: 'orange_money' | 'mtn_momo';
  purpose: 'membership' | 'course' | 'book' | 'app' | 'product' | 'vpn';
  targetId?: string;
  targetTitle?: string;
  status: 'pending' | 'success' | 'failed';
  timestamp: string;
  webhookVerified: boolean;
  phoneNumber: string;
}

export interface ReferralUser {
  id: string;
  name: string;
  email: string;
  date: string;
  status: 'pending_registration' | 'active_verified';
  rewardGranted: boolean;
  rewardAmount: number; // in FCFA
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number; // in FCFA
  method: 'orange_money' | 'mtn_momo';
  phoneNumber: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'paid';
  requestDate: string;
  processedDate?: string;
  notes?: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number; // in FCFA
  description: string;
  date: string;
  balanceAfter: number;
}

export type VPNProtocol = 'VLESS' | 'VMess' | 'Shadowsocks' | 'Trojan' | 'SSH' | 'SOCKS' | 'Hysteria2' | 'WireGuard';

export interface VPNServer {
  id: string;
  country: string;
  countryCode: string;
  city: string;
  name: string;
  ip: string;
  status: 'online' | 'maintenance' | 'offline';
  latencyMs: number;
  capacityPercent: number;
  supportedProtocols: VPNProtocol[];
  flag: string;
}

export interface VPNConfigProfile {
  id: string;
  name: string;
  protocol: VPNProtocol;
  serverAddress: string;
  port: number;
  uuidOrKey: string;
  networkType: 'tcp' | 'ws' | 'grpc' | 'udp';
  tls: boolean;
  rawConfig: string;
  createdAt: string;
}

export interface VPNSubscription {
  id: string;
  planName: string;
  status: 'active' | 'expired' | 'suspended';
  startDate: string;
  expirationDate: string;
  trafficUsedGB: number;
  trafficLimitGB: number;
  autoRenew: boolean;
}

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: Role;
  content: string;
  imageUrl?: string;
  category: 'Tech' | 'Entrepreneuriat' | 'Cryptomonnaie' | 'Opportunités' | 'Général';
  likesCount: number;
  likedByCurrentUser: boolean;
  commentsCount: number;
  timestamp: string;
  comments: {
    id: string;
    authorName: string;
    authorAvatar: string;
    content: string;
    timestamp: string;
  }[];
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'Technologie' | 'Intelligence Artificielle' | 'Entrepreneuriat' | 'Éducation' | 'Innovation Africaine' | 'Opportunités' | 'Business' | 'Marketing Numérique';
  author: string;
  date: string;
  readTime: string;
  imageUrl: string;
  isPremium: boolean;
  viewsCount: number;
}

export interface NotificationItem {
  id: string;
  type: 'registration' | 'login' | 'payment_confirmed' | 'payment_failed' | 'account_activated' | 'course_unlocked' | 'new_book' | 'order' | 'referral' | 'reward' | 'withdrawal' | 'vpn_renewal' | 'vpn_expired' | 'admin_announcement';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  performedBy: string;
  target: string;
  timestamp: string;
  details: string;
  category: 'user' | 'content' | 'finance' | 'security' | 'system';
}

export interface SiteSettings {
  appName: string;
  slogan: string;
  registrationFee: number; // default 1050 FCFA
  referralRewardAmount: number; // default 50 FCFA
  minimumWithdrawalAmount: number; // default 1100 FCFA
  contactEmail: string;
  supportPhone: string;
  adminEmail: string; // kenyojohnsonroberto@gmail.com
  adminName: string;
  adminOmAccount: string; // Orange Money administrator account
  adminMomoAccount: string; // MTN Mobile Money administrator account
  sandboxMode: boolean;
  activeLanguages: LanguageCode[];
  maintenanceMode: boolean;
}

export interface FirestoreAdminCheckResult {
  isAuthorized: boolean;
  isAdminFlag: boolean;
  role: string;
  source: string;
  errorMessage?: string;
}

