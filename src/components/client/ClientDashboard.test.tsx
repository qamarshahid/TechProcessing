import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ClientDashboard } from './ClientDashboard';

// Mock the API module
vi.mock('../../lib/api', () => ({
  apiClient: {
    getClientTransactionHistory: vi.fn().mockResolvedValue({
      invoices: [
        { 
          id: 'inv1', 
          description: 'Test Invoice', 
          amount: '100', 
          status: 'PAID', 
          due_date: '2025-08-10',
          payment_method: 'Credit Card'
        },
        { 
          id: 'inv2', 
          description: 'Unpaid Invoice', 
          amount: '50', 
          status: 'UNPAID', 
          due_date: '2025-08-15',
          payment_method: 'Bank Transfer'
        }
      ]
    }),
    getClientSubscriptions: vi.fn().mockResolvedValue({
      subscriptions: []
    }),
  }
}));

// Mock the auth context
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { full_name: 'Test User' }
  })
}));

describe('ClientDashboard', () => {
  it('renders loading spinner initially', () => {
    render(<ClientDashboard />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders stats and recent invoices after loading', async () => {
    render(<ClientDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText(/Welcome, Test User/)).toBeInTheDocument();
    });
    
    expect(screen.getByText(/Total Invoices/)).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText(/Paid Amount/)).toBeInTheDocument();
    expect(screen.getByText('$150')).toBeInTheDocument();
    expect(screen.getByText(/Unpaid Invoices/)).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Test Invoice')).toBeInTheDocument();
    expect(screen.getByText('Unpaid Invoice')).toBeInTheDocument();
  });

  it('shows correct status color for invoices', async () => {
    render(<ClientDashboard />);
    
    const paidStatus = await screen.findByText('PAID');
    const unpaidStatus = await screen.findByText('UNPAID');
    
    expect(paidStatus.className).toMatch(/bg-accent100/);
    expect(unpaidStatus.className).toMatch(/bg-yellow-100/);
  });
});
