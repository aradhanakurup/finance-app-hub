# Production Deployment Guide

## Overview
This guide covers the production deployment of the Indian Finance Hub application, including environment setup, database configuration, security measures, and monitoring.

## Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+ database
- Domain name and SSL certificate
- Email service (SMTP)
- File storage service (AWS S3, Google Cloud Storage, etc.)
- Monitoring service (Sentry, DataDog, etc.)

## 1. Environment Configuration

### 1.1 Environment Variables
Copy the `env.example` file to `.env.local` and configure the following variables:

```bash
# Database Configuration
DATABASE_URL="postgresql://username:password@host:port/database_name"

# Next.js Configuration
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secure-secret-key"

# JWT Configuration
JWT_SECRET="your-jwt-secret-key"

# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="noreply@your-domain.com"

# File Upload Configuration
UPLOAD_DIR="uploads"
MAX_FILE_SIZE="10485760"

# Error Monitoring
SENTRY_DSN="your-sentry-dsn"
SENTRY_ENVIRONMENT="production"

# Analytics
NEXT_PUBLIC_GA_ID="your-ga-id"

# Security Configuration
CORS_ORIGIN="https://your-domain.com"
RATE_LIMIT_WINDOW="900000"
RATE_LIMIT_MAX_REQUESTS="100"

# Feature Flags
ENABLE_DEALER_ONBOARDING="true"
ENABLE_ANALYTICS="true"
ENABLE_EMAIL_NOTIFICATIONS="true"
ENABLE_DOCUMENT_VERIFICATION="true"
```

### 1.2 Security Best Practices
- Use strong, unique secrets for JWT and NextAuth
- Enable HTTPS only
- Set up proper CORS origins
- Configure rate limiting
- Use environment-specific database URLs

## 2. Database Setup

### 2.1 Database Migration
```bash
# Install dependencies
npm install

# Run database migrations
npm run migrate

# Seed initial data (optional)
npm run seed
```

### 2.2 Database Optimization
- Create indexes on frequently queried columns
- Set up database connection pooling
- Configure backup schedules
- Monitor query performance

## 3. Application Deployment

### 3.1 Build and Deploy
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start the production server
npm start
```

### 3.2 Process Management
Use PM2 for process management:
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "finance-hub" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### 3.3 Reverse Proxy (Nginx)
Create an Nginx configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
```

## 4. Security Hardening

### 4.1 Application Security
- Enable HTTPS redirects
- Implement proper session management
- Validate all user inputs
- Sanitize file uploads
- Implement rate limiting
- Set up security headers

### 4.2 Database Security
- Use connection pooling
- Implement row-level security
- Regular security updates
- Encrypt sensitive data
- Backup encryption

### 4.3 Infrastructure Security
- Use VPC and security groups
- Implement network segmentation
- Regular security audits
- Monitor access logs
- Set up intrusion detection

## 5. Monitoring and Logging

### 5.1 Error Monitoring
Configure Sentry for error tracking:
```javascript
// next.config.ts
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  // your existing config
};

const sentryWebpackPluginOptions = {
  silent: true,
  org: "your-org",
  project: "finance-hub",
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
```

### 5.2 Application Logging
- Implement structured logging
- Log all API requests
- Monitor performance metrics
- Set up log aggregation
- Configure log retention

### 5.3 Health Checks
Create health check endpoints:
```typescript
// app/api/health/route.ts
export async function GET() {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'unhealthy', error: error.message },
      { status: 500 }
    );
  }
}
```

## 6. Performance Optimization

### 6.1 Application Performance
- Enable Next.js optimizations
- Implement caching strategies
- Optimize images and assets
- Use CDN for static content
- Monitor Core Web Vitals

### 6.2 Database Performance
- Optimize queries
- Use database indexes
- Implement connection pooling
- Monitor slow queries
- Regular maintenance

## 7. Backup and Recovery

### 7.1 Database Backups
```bash
# Automated backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > backup_$DATE.sql
gzip backup_$DATE.sql
aws s3 cp backup_$DATE.sql.gz s3://your-backup-bucket/
```

### 7.2 Application Backups
- Backup uploaded files
- Backup configuration files
- Document deployment procedures
- Test recovery procedures

## 8. Scaling Considerations

### 8.1 Horizontal Scaling
- Use load balancers
- Implement session sharing
- Use external databases
- Cache with Redis
- Use CDN for assets

### 8.2 Vertical Scaling
- Monitor resource usage
- Optimize memory usage
- Use appropriate instance sizes
- Implement auto-scaling

## 9. Maintenance Procedures

### 9.1 Regular Maintenance
- Security updates
- Dependency updates
- Database maintenance
- Log rotation
- Performance monitoring

### 9.2 Deployment Procedures
- Use blue-green deployments
- Implement rollback procedures
- Test in staging environment
- Monitor deployment metrics
- Document changes

## 10. Support and Documentation

### 10.1 Support System
- Set up help desk
- Create knowledge base
- Implement ticketing system
- Provide user documentation
- Train support staff

### 10.2 Monitoring Alerts
- Set up uptime monitoring
- Configure error alerts
- Monitor performance metrics
- Alert on security events
- Track business metrics

## 11. Compliance and Legal

### 11.1 Data Protection
- Implement GDPR compliance
- Secure data storage
- User consent management
- Data retention policies
- Privacy policy updates

### 11.2 Financial Compliance
- Audit trail maintenance
- Transaction logging
- Regulatory reporting
- Compliance monitoring
- Legal documentation

## 12. Testing and Quality Assurance

### 12.1 Testing Strategy
- Unit tests
- Integration tests
- End-to-end tests
- Performance tests
- Security tests

### 12.2 Quality Gates
- Code review process
- Automated testing
- Performance benchmarks
- Security scans
- Documentation updates

## 13. Emergency Procedures

### 13.1 Incident Response
- Define incident severity levels
- Establish response team
- Create communication plan
- Document escalation procedures
- Practice incident response

### 13.2 Disaster Recovery
- Backup restoration procedures
- System recovery plans
- Data recovery processes
- Business continuity plans
- Regular disaster recovery tests

## 14. Cost Optimization

### 14.1 Infrastructure Costs
- Monitor resource usage
- Optimize instance sizes
- Use reserved instances
- Implement auto-scaling
- Regular cost reviews

### 14.2 Operational Costs
- Optimize database queries
- Use efficient caching
- Monitor third-party services
- Regular cost audits
- Budget planning

## 15. Go-Live Checklist

- [ ] Environment variables configured
- [ ] Database migrated and seeded
- [ ] SSL certificates installed
- [ ] Domain DNS configured
- [ ] Monitoring tools set up
- [ ] Backup procedures tested
- [ ] Security scans completed
- [ ] Performance tests passed
- [ ] Support team trained
- [ ] Documentation updated
- [ ] Legal compliance verified
- [ ] Emergency procedures documented
- [ ] Rollback procedures tested
- [ ] Stakeholders notified
- [ ] Go-live plan approved

## 16. Post-Launch Monitoring

### 16.1 Key Metrics to Monitor
- Application uptime
- Response times
- Error rates
- User engagement
- Business metrics
- Security events
- Performance indicators

### 16.2 Regular Reviews
- Weekly performance reviews
- Monthly security audits
- Quarterly compliance checks
- Annual disaster recovery tests
- Continuous improvement planning

## Support and Contact

For technical support during deployment:
- Email: tech-support@financehub.com
- Phone: +91-XXX-XXX-XXXX
- Documentation: https://docs.financehub.com
- Status Page: https://status.financehub.com 