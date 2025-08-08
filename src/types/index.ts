export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'ADMIN' | 'CLIENT';
  created_at: string;
  updated_at: string;
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

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string, role: 'ADMIN' | 'CLIENT') => Promise<void>;
  signOut: () => Promise<void>;
}