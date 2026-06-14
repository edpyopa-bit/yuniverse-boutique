export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  sizes: string[];
  isFeatured: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: "qris" | "cash";
  paymentStatus: "pending" | "paid";
  status: "pending" | "processing" | "shipped" | "completed" | "cancelled";
  notes?: string;
  createdAt: string;
}

export interface SiteSettings {
  boutiqueName: string;
  boutiquePhone: string;
  address: string;
  announcement: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBannerUrl: string;
  aboutTitle?: string;
  aboutDescription?: string;
  aboutImageUrl?: string;
  aboutConsultationText?: string;
  instagramUrl?: string;
  footerQuote?: string;
  googleSpreadsheetId?: string;
}

export interface EmailLog {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  sentAt: string;
}
