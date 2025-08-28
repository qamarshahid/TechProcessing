# Tech Processing LLC - IT Services Management Platform

A production-ready full-stack IT services management platform built with React frontend and NestJS backend.

## Architecture

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Vite** for fast development and building

### Backend
- **NestJS** framework with TypeScript
- **PostgreSQL** database with JPA/Hibernate
- **JWT** authentication
- **TypeORM** for database operations
- **Swagger** for API documentation
- **Docker** support for containerization

## Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Role-based access control (ADMIN/CLIENT)
- Secure password hashing with BCrypt
- Rate limiting and brute-force protection

### 📊 Admin Dashboard
- Client management
- Invoice creation and tracking
- Service package management
- Revenue analytics
- User management
- Payment history
- Audit logs
- System settings

### 👤 Client Portal
- Personal invoice viewing
- Service package browsing
- Account management
- Payment processing

### 💳 Invoice Management
- Create, update, and delete invoices
- Multiple payment methods (Card, Zelle, CashApp, Bank Transfer)
- Status tracking (Paid, Unpaid, Overdue)
- PDF generation
- Automatic status updates

### 🛠️ Service Packages
- Predefined service offerings
- Customizable pricing and features
- Feature management

### 🔍 Audit & Security
- Comprehensive audit logging
- Security event monitoring
- User activity tracking
- System health monitoring

### 💰 Payment Processing
- Authorize.Net integration
- Multiple payment methods
- Payment links
- Subscription billing
- Refund processing

## Getting Started

### Prerequisites
- **Node.js 18** or higher
- **npm 8+**
- **PostgreSQL 12+**
- **Docker** (optional)

### Database Setup
1. Install PostgreSQL
2. Create a database:
   ```sql
   CREATE DATABASE techserve_pro;
   ```

### Environment Setup
1. Copy environment files:
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```

2. Update environment variables with your configuration

### Quick Start with Docker
```bash
# Clone the repository
git clone <repository-url>
cd tech-processing-platform

# Start with Docker Compose
npm run docker:up

# View logs
npm run docker:logs

# Stop services
npm run docker:down
```

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure database in `.env` file:
   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USERNAME=postgres
   DATABASE_PASSWORD=password
   DATABASE_NAME=techserve_pro
   JWT_SECRET=your-secret-key
   AUTHORIZENET_API_LOGIN_ID=your_api_login_id
   AUTHORIZENET_TRANSACTION_KEY=your_transaction_key
   ```

4. Run database migrations:
   ```bash
   npm run migration:run
   ```

5. Seed initial data:
   ```bash
   npm run db:seed
   ```
6. Run the NestJS application:
   ```bash
   npm run start:dev
   ```

The backend will start on `http://localhost:8081`

### Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```env
   VITE_API_URL=http://localhost:8081/api
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will start on `http://localhost:5173`

## 🔒 Authentication & Security

### Default Admin Account (Development Only)
- **Email**: admin@techprocessing.com
- **Password**: Configured via environment variables (default: admin123)

### Default Client Account (Development Only)
- **Email**: client@example.com
- **Password**: Configured via environment variables (default: password123)

> **Security Note**: In production, these credentials should be configured via environment variables (`ADMIN_EMAIL`, `ADMIN_PASSWORD`, `USER_EMAIL`, `USER_PASSWORD`). See `backend/.env.security-template` for the complete configuration template.

## 🛡️ Security Features

- **Secure Logging**: Sensitive data is automatically sanitized from logs
- **Environment-based Configuration**: All secrets configurable via environment variables
- **Production-safe Defaults**: Test accounts only available in development mode
- **JWT Security**: Configurable secret keys and expiration times
- **Data Sanitization**: API responses are logged safely without exposing sensitive fields

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get current user profile

### Users
- `GET /api/users/me` - Get current user profile
- `GET /api/users` - Get all users (Admin only)
- `POST /api/users` - Create user (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Invoices
- `GET /api/invoices` - Get invoices (filtered by role)
- `POST /api/invoices` - Create invoice (Admin only)
- `GET /api/invoices/:id` - Get invoice by ID
- `PATCH /api/invoices/:id` - Update invoice (Admin only)
- `DELETE /api/invoices/:id` - Delete invoice (Admin only)

### Payments
- `POST /api/payments/hosted-token` - Generate hosted payment token
- `GET /api/payments` - Get payments (filtered by role)
- `GET /api/payments/history` - Get payment history
- `POST /api/payments` - Create payment
- `POST /api/payments/webhook` - Authorize.Net webhook endpoint
- `GET /api/payments/:id` - Get payment by ID
- `PATCH /api/payments/:id/status` - Update payment status (Admin only)

### Service Packages
- `GET /api/service-packages` - Get all service packages
- `POST /api/service-packages` - Create package (Admin only)
- `GET /api/service-packages/:id` - Get package by ID
- `PATCH /api/service-packages/:id` - Update package (Admin only)
- `DELETE /api/service-packages/:id` - Delete package (Admin only)

### Audit Logs
- `GET /api/audit` - Get audit logs (Admin only)
- `GET /api/audit/stats` - Audit statistics (Admin only)
- `GET /api/audit/entity/:type/:id` - Get logs for specific entity (Admin only)

### Health Check
- `GET /api/health` - System health status
## Project Structure

```
├── backend/                 # Node.js NestJS backend
│   ├── src/
│   │   ├── auth/            # Authentication module
│   │   ├── users/           # User management
│   │   ├── invoices/        # Invoice management
│   │   ├── payments/        # Payment processing
│   │   ├── audit/           # Audit logging
│   │   ├── health/          # Health check
│   │   └── common/          # Shared utilities
│   ├── Dockerfile
│   └── package.json
├── src/                     # React frontend
│   ├── components/          # React components
│   │   ├── admin/           # Admin components
│   │   └── client/          # Client components
│   ├── contexts/           # React contexts
│   ├── lib/                # Utilities and API client
│   └── types/              # TypeScript types
├── docker-compose.yml      # Docker composition
├── Dockerfile              # Backend Docker image
└── package.json            # Frontend dependencies
```

## Development

### Backend Development
- The backend uses NestJS with hot reloading
- Database schema is automatically created/updated via TypeORM
- Default data is seeded on application startup
- Swagger documentation available at `/api/docs`

### Frontend Development
- Vite provides hot module replacement
- TypeScript for type safety
- Tailwind CSS for styling
- Component-based architecture

## Deployment

### Docker Deployment
```bash
# Build and start all services
npm run docker:up

# Build backend image only
npm run docker:build
```

### Backend Deployment
- Build: `npm run build`
- Deploy to cloud platforms (GCP Cloud Run, AWS ECS, Azure Container Instances)
- Configure production database
- Set environment variables

### Frontend Deployment
- Build: `npm run build`
- Deploy to static hosting (Vercel, Netlify, Firebase Hosting)

## Security Features

- JWT token-based authentication
- Password encryption with bcrypt
- CORS configuration
- Role-based access control
- Input validation
- Rate limiting
- Audit logging
- Secure headers with Helmet
- Environment-based configuration

## Monitoring & Logging

- Comprehensive audit trails
- Request/response logging
- Error tracking and filtering
- Health check endpoints
- Performance monitoring

## Testing

```bash
# Backend tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Frontend tests (if implemented)
cd backend && npm run test

# Frontend tests
npm run test
```

## License

This project is licensed under the MIT License.# Test deployment
# Testing GitHub Pages deployment
# Tech Processing LLC - Republishing
