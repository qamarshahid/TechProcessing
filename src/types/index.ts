export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'CLIENT' | 'AGENT';
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  companyName?: string;
  address?: any;
  communicationDetails?: any[];
  lastLogin?: string;
}

export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  client_id: string;
  client?: User;
  amount: number;
  status: 'PAID' | 'UNPAID' | 'OVERDUE';
  payment_method?: 'CARD' | 'ZELLE' | 'CASHAPP' | 'BANK_TRANSFER';
  description: string;
  due_date: string;
  paid_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: string;
  userId: string;
  agentCode: string;
  salesPersonName: string;
  closerName: string;
  agentCommissionRate: number;
  closerCommissionRate: number;
  totalEarnings: number;
  totalPaidOut: number;
  pendingCommission: number;
  totalSales: number;
  totalSalesValue: number;
  isActive: boolean;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  user?: User;
}

export interface Closer {
  id: string;
  closerCode: string;
  closerName: string;
  commissionRate: number;
  status: 'ACTIVE' | 'INACTIVE';
  email?: string;
  phone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentSale {
  id: string;
  agentId: string;
  clientId?: string;
  closerId?: string;
  saleReference: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  closerName: string;
  serviceName: string;
  serviceDescription?: string;
  saleAmount: number;
  agentCommissionRate: number;
  closerCommissionRate: number;
  agentCommission: number;
  closerCommission: number;
  totalCommission: number;
  saleStatus: SaleStatus;
  commissionStatus: CommissionStatus;
  saleDate?: string;
  paymentDate?: string;
  commissionPaidDate?: string;
  notes?: string;
  clientDetails?: any;
  metadata?: any;
  originalSaleId?: string;
  originalSale?: AgentSale;
  changesMade?: any;
  resubmissionCount?: number;
  createdAt: string;
  updatedAt: string;
  agent?: Agent;
  client?: User;
  closer?: Closer;
}

export enum SaleStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  RESUBMITTED = 'RESUBMITTED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export enum CommissionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName: string, role: 'ADMIN' | 'CLIENT' | 'AGENT') => Promise<any>;
  signOut: () => Promise<void>;
}