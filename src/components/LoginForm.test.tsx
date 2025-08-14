import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LoginForm } from './LoginForm';

// Mocks
const navigateMock = vi.fn();
const signInMock = vi.fn().mockResolvedValue({ access_token: 'token', user: { id: '1', email: 'test@example.com' } });
const signUpMock = vi.fn().mockResolvedValue({ access_token: 'token', user: { id: '1', email: 'test@example.com' } });

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    signIn: signInMock,
    signUp: signUpMock,
    signOut: vi.fn(),
    user: null,
    loading: false,
  }),
}));

beforeEach(() => {
  navigateMock.mockClear();
  signInMock.mockClear();
  signUpMock.mockClear();
});

describe('LoginForm', () => {
  it('renders and logs in successfully', async () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByLabelText(/Email Address/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/Password/i), 'password123');

    await userEvent.click(screen.getByRole('button', { name: /Access Portal/i }));

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(navigateMock).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('toggles to register and validates full name', async () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    // Switch to register mode
    await userEvent.click(screen.getByRole('button', { name: /Register here/i }));

    // Full Name field should appear
    expect(await screen.findByLabelText(/Full Name/i)).toBeInTheDocument();

    // Fill with whitespace to bypass native required and trigger trim() validation
    await userEvent.type(screen.getByLabelText(/Full Name/i), '   ');
    await userEvent.type(screen.getByLabelText(/Email Address/i), 'new@example.com');
    await userEvent.type(screen.getByLabelText(/Password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    expect(await screen.findByText(/Full name is required/i)).toBeInTheDocument();
    expect(signUpMock).not.toHaveBeenCalled();
  });

  it('registers successfully with full name and navigates', async () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    // Switch to register mode
    await userEvent.click(screen.getByRole('button', { name: /Register here/i }));

    await userEvent.type(screen.getByLabelText(/Full Name/i), 'Alice Smith');
    await userEvent.type(screen.getByLabelText(/Email Address/i), 'alice@example.com');
    await userEvent.type(screen.getByLabelText(/Password/i), 'password123');

    await userEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    await waitFor(() => {
      expect(signUpMock).toHaveBeenCalledWith('alice@example.com', 'password123', 'Alice Smith', 'CLIENT');
      expect(navigateMock).toHaveBeenCalledWith('/dashboard');
    });
  });
});
