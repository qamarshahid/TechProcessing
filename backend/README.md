# TechServe Pro Backend

A secure, scalable Node.js backend built with NestJS and PostgreSQL for IT services client portal management.

## 🚀 Features

### 🔐 Authentication & Security
- **JWT Authentication** with role-based access control (ADMIN/CLIENT)
- **Password Hashing** with bcrypt (12 rounds)
- **Input Validation** with class-validator
- **Rate Limiting** to prevent abuse
- **CORS Configuration** for secure cross-origin requests

### 👥 User Management
- Role-based user system (ADMIN/CLIENT)
- User registration and authentication
- Profile management
- Account activation/deactivation
- Last login tracking

### 📄 Invoice Management
- Create, read, update, delete invoices
- Invoice status tracking (DRAFT, SENT, PAID, OVERDUE, CANCELLED)
- Automatic invoice numbering
- Line items support
- Due date management
- Tax calculations

### 💳 Payment Processing
- **Authorize.Net Integration** for card payments
- **Alternative Payment Methods**: Zelle, CashApp, Bank Transfer
- Payment status tracking
- Transaction logging
- Automatic invoice status updates

### 📦 Service Packages
- Predefined service offerings
- Feature lists and pricing
- Package management for admins

### 📊 Audit Logging
- Comprehensive activity tracking
- User action logging
- Entity change history
- Security event monitoring

### 📈 Analytics & Reporting
- User statistics
- Invoice analytics
- Payment reports
- Audit trail reports

## 🛠️ Technology Stack

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT with Passport
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **Payment Gateway**: Authorize.Net
- **Security**: bcrypt, rate limiting, CORS

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn

## 🚀 Quick Start

### 1. Environment Setup

```bash
# Copy environment file
cp .env.example .env

# Edit environment variables
nano .env
```

### 2. Database Setup

```sql
-- Create database
CREATE DATABASE techserve_pro;

-- Create user (optional)
CREATE USER techserve_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE techserve_pro TO techserve_user;
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run start:dev
```

The server will start on `http://localhost:8081`

## 📚 API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://localhost:8081/api/docs`
- **API Base URL**: `http://localhost:8081/api`

## 🔑 Default Accounts

### Admin Account
- **Email**: `admin@techservepro.com`
- **Password**: `admin123`
- **Role**: ADMIN

### Client Account  
- **Email**: `client@example.com`
- **Password**: `password123`
- **Role**: CLIENT

## 🛡️ Security Features

### Authentication
- JWT tokens with configurable expiration
- Password hashing with bcrypt (12 rounds)
- Role-based access control
- Account activation/deactivation

### Input Validation
- Request body validation with class-validator
- SQL injection prevention with TypeORM
- XSS protection with input sanitization

### Rate Limiting
- Configurable request limits per IP
- Protection against brute force attacks

### Audit Logging
- All user actions logged
- Entity change tracking
- Security event monitoring

## 📊 API Endpoints

### Authentication
```
POST /api/auth/login          # User login
POST /api/auth/register       # User registration  
GET  /api/auth/profile        # Get current user profile
```

### Users (Admin Only)
```
GET    /api/users             # Get all users
POST   /api/users             # Create new user
GET    /api/users/:id         # Get user by ID
PATCH  /api/users/:id         # Update user
DELETE /api/users/:id         # Delete user
GET    /api/users/stats       # User statistics
```

### Invoices
```
GET    /api/invoices          # Get invoices (filtered by role)
POST   /api/invoices          # Create invoice (Admin only)
GET    /api/invoices/:id      # Get invoice by ID
PATCH  /api/invoices/:id      # Update invoice (Admin only)
DELETE /api/invoices/:id      # Delete invoice (Admin only)
PATCH  /api/invoices/:id/status # Update invoice status (Admin only)
GET    /api/invoices/stats    # Invoice statistics (Admin only)
```

### Payments
```
GET    /api/payments          # Get payments (filtered by role)
POST   /api/payments          # Create payment
GET    /api/payments/:id      # Get payment by ID
PATCH  /api/payments/:id/status # Update payment status (Admin only)
GET    /api/payments/stats    # Payment statistics (Admin only)
```

### Service Packages
```
GET    /api/service-packages  # Get all service packages
POST   /api/service-packages  # Create package (Admin only)
GET    /api/service-packages/:id # Get package by ID
PATCH  /api/service-packages/:id # Update package (Admin only)
DELETE /api/service-packages/:id # Delete package (Admin only)
```

### Audit Logs (Admin Only)
```
GET    /api/audit            # Get audit logs
GET    /api/audit/stats      # Audit statistics
GET    /api/audit/entity/:type/:id # Get logs for specific entity
```

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=techserve_pro

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=24h

# Server
PORT=8080
NODE_ENV=development

# Authorize.Net
AUTHORIZENET_API_LOGIN_ID=your_api_login_id
AUTHORIZENET_TRANSACTION_KEY=your_transaction_key
AUTHORIZENET_ENVIRONMENT=sandbox

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100
```

## 🚀 Deployment

### Production Build

```bash
npm run build
npm run start:prod
```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 8080
CMD ["node", "dist/main"]
```

### Cloud Deployment

The application is ready for deployment on:
- **AWS**: ECS, Lambda, Elastic Beanstalk
- **GCP**: Cloud Run, App Engine, Compute Engine
- **Azure**: Container Instances, App Service

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Development

### Database Migrations

```bash
# Generate migration
npm run migration:generate -- src/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

### Code Quality

```bash
# Linting
npm run lint

# Formatting
npm run format
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@techservepro.com or create an issue in the repository.