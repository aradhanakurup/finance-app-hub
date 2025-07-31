# 🚀 Fin5 - Finance. Fast. Five minutes flat.

A comprehensive financial technology platform that streamlines loan applications, integrates insurance, and provides real-time tracking with multi-lender support.

![Fin5 Logo](https://img.shields.io/badge/Fin5-Finance%20Fast%20Five%20minutes%20flat-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.11.1-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC)

## 🌟 Features

### 💳 **Loan Application System**
- **Multi-step Application Wizard** - 13-step comprehensive application process
- **Real-time Prescreening** - Instant eligibility check with AI-powered risk assessment
- **Document Upload & Verification** - Secure document management with OCR
- **Multi-lender Integration** - Connect with HDFC Bank, ICICI Bank, and more
- **Application Tracking** - Real-time status updates and notifications

### 🛡️ **Insurance Integration**
- **Loan Protection Insurance** - Coverage for death, disability, and job loss
- **Multiple Providers** - ICICI Lombard, HDFC Ergo, Bajaj Allianz, Tata AIG
- **Risk Assessment** - AI-powered premium calculation
- **Policy Management** - Complete insurance lifecycle management

### 💰 **Payment System**
- **Razorpay Integration** - Secure payment processing
- **Multiple Payment Types** - Application fees, insurance premiums, bundled payments
- **Cost Breakdown** - Transparent pricing with GST calculation
- **Payment Tracking** - Real-time payment status and history

### 👥 **User Management**
- **Customer Portal** - Complete application management
- **Dealer Portal** - Commission tracking and application management
- **Lender Portal** - Application review and approval system
- **Admin Dashboard** - Analytics, user management, and system monitoring

### 🔐 **Security & Compliance**
- **RBI Compliant** - Full compliance with Indian financial regulations
- **KYC Integration** - Signzy-powered identity verification
- **Data Encryption** - AES-256 encryption for sensitive data
- **Audit Logging** - Complete audit trail for compliance

## 🏗️ Architecture

```
fin5-finance-app/
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── api/               # API Routes
│   │   │   ├── admin/         # Admin APIs
│   │   │   ├── applications/  # Application APIs
│   │   │   ├── insurance/     # Insurance APIs
│   │   │   ├── payments/      # Payment APIs
│   │   │   └── auth/          # Authentication APIs
│   │   ├── components/        # React Components
│   │   │   ├── steps/         # Application wizard steps
│   │   │   ├── admin/         # Admin components
│   │   │   └── ui/            # UI components
│   │   └── services/          # Business logic services
│   ├── lib/                   # Utility functions
│   └── types/                 # TypeScript type definitions
├── prisma/                    # Database schema and migrations
├── scripts/                   # Database seeding scripts
└── docs/                      # Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL (for production)
- SQLite (for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aradhanakurup/finance-app-hub.git
   cd finance-app-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run migrate      # Run database migrations
npm run seed         # Seed database with sample data
npm run deploy       # Deploy to Vercel
```

### Database Management

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

## 🌐 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables**
   - Go to Vercel Dashboard
   - Navigate to your project settings
   - Add all environment variables from `env.production.example`

### Environment Variables

Required environment variables for production:

```env
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# JWT Secret
JWT_SECRET="your-super-secure-jwt-secret"

# Admin Credentials
ADMIN_USERNAME="admin"
ADMIN_PASSWORD_HASH="$2b$10$your-bcrypt-hash"

# Payment Gateway
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-secret"

# KYC Integration
SIGNZY_API_KEY="your-signzy-api-key"
SIGNZY_API_SECRET="your-signzy-secret"
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Application Endpoints
- `POST /api/applications/submit` - Submit loan application
- `GET /api/applications/tracker` - Get application status
- `GET /api/applications/[id]/status` - Get specific application status

### Insurance Endpoints
- `GET /api/insurance/quotes` - Get insurance quotes
- `POST /api/insurance/policies` - Create insurance policy
- `POST /api/insurance/claims` - Submit insurance claim

### Payment Endpoints
- `POST /api/payments/create-order` - Create payment order
- `POST /api/payments/verify` - Verify payment
- `GET /api/payments/cost-breakdown` - Get cost breakdown

### Admin Endpoints
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/analytics` - Get analytics data
- `GET /api/admin/dealers` - Get dealer information

## 🔧 Configuration

### Database Configuration
The application uses Prisma ORM with support for:
- **Development**: SQLite
- **Production**: PostgreSQL

### Payment Gateway
Currently integrated with Razorpay for Indian market.

### Insurance Providers
Integrated with major Indian insurance providers:
- ICICI Lombard
- HDFC Ergo
- Bajaj Allianz
- Tata AIG

## 📈 Analytics & Monitoring

### Built-in Analytics
- Application conversion rates
- Lender performance metrics
- Insurance policy analytics
- Payment success rates

### Monitoring
- Real-time application status
- Error tracking and logging
- Performance monitoring
- User activity tracking

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password security
- **CORS Protection** - Cross-origin resource sharing protection
- **Rate Limiting** - API rate limiting to prevent abuse
- **Input Validation** - Comprehensive input validation
- **SQL Injection Protection** - Prisma ORM protection
- **XSS Protection** - Cross-site scripting protection

## 📱 Mobile Responsive

The application is fully responsive and optimized for:
- Desktop browsers
- Tablets
- Mobile devices
- Progressive Web App (PWA) ready

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- 📧 Email: akurup@astrovanta.tech
- 📱 WhatsApp: +91 7760997315
- 🌐 Website: [Fin5](https://fin5.in)

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing framework
- **Prisma Team** - For the excellent ORM
- **Tailwind CSS** - For the utility-first CSS framework
- **Razorpay** - For payment gateway integration
- **Signzy** - For KYC verification services

---

**Made with ❤️ by the Fin5 Team**

*Finance. Fast. Five minutes flat.*
