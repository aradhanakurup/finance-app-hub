# External API Integration Guide for Prescreening System

This guide explains how to integrate external APIs to make the prescreening system production-ready with real data verification.

## 🎯 **Current Status**

✅ **Working Features:**
- Mock external API service layer
- Realistic data generation for development
- Proper error handling and fallbacks
- Configuration management system

🔄 **Ready for Production Integration:**
- PAN/Aadhaar verification APIs
- Credit bureau data APIs
- Bank statement analysis APIs
- Income verification APIs

## 📋 **Required External APIs**

### 1. **PAN/Aadhaar Verification APIs**

#### **NSDL PAN Verification API**
- **Provider:** National Securities Depository Limited (NSDL)
- **Endpoint:** `https://api.nsdl.co.in/pan-verification`
- **Purpose:** Verify PAN card authenticity and fetch holder details
- **Setup:** Contact NSDL for API access and credentials

#### **UIDAI Aadhaar Verification API**
- **Provider:** Unique Identification Authority of India (UIDAI)
- **Endpoint:** `https://api.uidai.gov.in/aadhaar-verification`
- **Purpose:** Verify Aadhaar number and fetch basic details
- **Setup:** Apply for UIDAI API access through official channels

#### **DigiLocker API (Alternative)**
- **Provider:** Government of India
- **Endpoint:** `https://api.digilocker.gov.in`
- **Purpose:** Access government-issued documents including PAN/Aadhaar
- **Setup:** Register as a DigiLocker partner organization

### 2. **Credit Bureau APIs**

#### **CIBIL API**
- **Provider:** TransUnion CIBIL
- **Endpoint:** `https://api.cibil.com`
- **Purpose:** Fetch credit score and credit history
- **Setup:** Apply for CIBIL API partnership

#### **Experian API**
- **Provider:** Experian India
- **Endpoint:** `https://api.experian.com`
- **Purpose:** Alternative credit bureau data
- **Setup:** Contact Experian for API access

#### **Equifax API**
- **Provider:** Equifax India
- **Endpoint:** `https://api.equifax.com`
- **Purpose:** Credit bureau data
- **Setup:** Apply for Equifax API access

#### **CRIF High Mark API**
- **Provider:** CRIF High Mark
- **Endpoint:** `https://api.crifhighmark.com`
- **Purpose:** Credit bureau data
- **Setup:** Contact CRIF for API partnership

### 3. **Bank Statement Analysis APIs**

#### **Account Aggregator (AA) APIs**
- **Provider:** RBI-regulated Account Aggregator ecosystem
- **Endpoint:** `https://api.accountaggregator.org`
- **Purpose:** Fetch bank statements with user consent
- **Setup:** Register as an Account Aggregator entity

#### **Yodlee API**
- **Provider:** Yodlee (Envestnet)
- **Endpoint:** `https://api.yodlee.com`
- **Purpose:** Bank data aggregation and analysis
- **Setup:** Contact Yodlee for India market access

#### **Plaid API (If Available)**
- **Provider:** Plaid
- **Endpoint:** `https://api.plaid.com`
- **Purpose:** Bank data aggregation
- **Setup:** Check Plaid's India availability

### 4. **Income Verification APIs**

#### **EPFO API**
- **Provider:** Employees' Provident Fund Organisation
- **Endpoint:** `https://api.epfo.gov.in`
- **Purpose:** Verify salary and employment details
- **Setup:** Apply for EPFO API access

#### **Income Tax Department API**
- **Provider:** Income Tax Department
- **Endpoint:** `https://api.incometax.gov.in`
- **Purpose:** Verify income tax returns and income details
- **Setup:** Apply through official channels

#### **GST API**
- **Provider:** Goods and Services Tax Network
- **Endpoint:** `https://api.gst.gov.in`
- **Purpose:** Verify business income for self-employed
- **Setup:** Apply for GST API access

## 🚀 **Implementation Steps**

### **Step 1: Environment Setup**

1. **Copy the production environment template:**
   ```bash
   cp env.production.example .env.production
   ```

2. **Fill in your API credentials:**
   ```bash
   # Edit .env.production with your actual API keys
   nano .env.production
   ```

3. **Set environment variables:**
   ```bash
   export ENABLE_MOCK_DATA=false
   ```

### **Step 2: API Provider Registration**

#### **For PAN/Aadhaar Verification:**
1. **NSDL Registration:**
   - Visit NSDL website
   - Apply for PAN verification API access
   - Complete KYC and compliance requirements
   - Receive API credentials

2. **UIDAI Registration:**
   - Apply through UIDAI official portal
   - Submit required documents
   - Complete security audit
   - Get API access credentials

#### **For Credit Bureau Data:**
1. **CIBIL Partnership:**
   - Contact CIBIL business development
   - Submit partnership application
   - Complete technical integration
   - Receive API credentials

2. **Alternative Bureaus:**
   - Apply to Experian, Equifax, or CRIF
   - Complete similar registration process

#### **For Bank Statement Analysis:**
1. **Account Aggregator Registration:**
   - Apply to RBI for AA license
   - Complete technical compliance
   - Integrate with AA ecosystem

2. **Alternative Providers:**
   - Contact Yodlee for India market access
   - Check Plaid availability in India

### **Step 3: Code Integration**

#### **Update External API Service:**

1. **Replace mock implementations with real API calls:**
   ```typescript
   // In src/services/externalAPIs.ts
   
   // Replace mock PAN verification
   async verifyPAN(panNumber: string): Promise<PANVerificationResponse> {
     const response = await fetch(`${EXTERNAL_API_CONFIG.PAN_AADHAAR.NSDL_PAN.baseUrl}/verify`, {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${EXTERNAL_API_CONFIG.PAN_AADHAAR.NSDL_PAN.apiKey}`,
         'Content-Type': 'application/json'
       },
       body: JSON.stringify({ pan: panNumber })
     })
     
     return await response.json()
   }
   ```

2. **Add proper error handling:**
   ```typescript
   try {
     const result = await this.verifyPAN(panNumber)
     return result
   } catch (error) {
     console.error('PAN verification failed:', error)
     return {
       isValid: false,
       error: API_ERROR_MESSAGES.PAN_VERIFICATION_FAILED
     }
   }
   ```

#### **Update Configuration:**

1. **Add rate limiting:**
   ```typescript
   // Implement rate limiting for each API
   const rateLimiter = new RateLimiter({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   })
   ```

2. **Add retry logic:**
   ```typescript
   async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
     try {
       return await fn()
     } catch (error) {
       if (retries > 0) {
         await new Promise(resolve => setTimeout(resolve, 1000))
         return withRetry(fn, retries - 1)
       }
       throw error
     }
   }
   ```

### **Step 4: Testing & Validation**

1. **Test with real data:**
   ```bash
   # Test PAN verification
   curl -X POST http://localhost:3000/api/prescreening/risk-profile \
     -H 'Content-Type: application/json' \
     -d '{"customerData":{"personalInfo":{"pan":"REALPAN1234"}}}'
   ```

2. **Validate responses:**
   - Check API response formats
   - Verify error handling
   - Test rate limiting
   - Validate data accuracy

### **Step 5: Production Deployment**

1. **Security considerations:**
   - Encrypt API keys at rest
   - Use HTTPS for all API calls
   - Implement proper logging
   - Add monitoring and alerting

2. **Performance optimization:**
   - Implement caching for API responses
   - Use connection pooling
   - Add request queuing for high load

3. **Compliance:**
   - Ensure RBI compliance for financial data
   - Follow UIDAI guidelines for Aadhaar data
   - Implement proper consent management
   - Add audit trails

## 🔧 **API Response Formats**

### **PAN Verification Response:**
```json
{
  "isValid": true,
  "name": "JOHN DOE",
  "status": "ACTIVE",
  "dateOfIssue": "2010-01-01",
  "error": null
}
```

### **Credit Bureau Response:**
```json
{
  "creditScore": 750,
  "bureauName": "CIBIL",
  "reportDate": "2024-01-15T00:00:00Z",
  "totalAccounts": 5,
  "activeAccounts": 3,
  "overdueAccounts": 0,
  "paymentHistory": [
    {
      "month": "2024-01",
      "status": "PAID"
    }
  ]
}
```

### **Bank Statement Response:**
```json
{
  "monthlyInflow": 75000,
  "monthlyOutflow": 45000,
  "averageBalance": 150000,
  "bouncedCheques": 0,
  "inflowTrend": "increasing",
  "salaryCredits": 1,
  "emiDebits": 2
}
```

## 📊 **Cost Considerations**

### **API Costs (Approximate):**
- **PAN Verification:** ₹2-5 per verification
- **Aadhaar Verification:** ₹1-3 per verification
- **Credit Bureau:** ₹50-100 per report
- **Bank Statement Analysis:** ₹10-25 per analysis
- **Income Verification:** ₹5-15 per verification

### **Volume Discounts:**
- Most providers offer volume discounts
- Negotiate rates based on expected usage
- Consider annual contracts for better rates

## 🛡️ **Security & Compliance**

### **Data Protection:**
- Encrypt all sensitive data
- Implement proper access controls
- Follow RBI guidelines for financial data
- Comply with UIDAI Aadhaar regulations

### **Consent Management:**
- Implement proper user consent flows
- Store consent records
- Allow users to revoke consent
- Follow data retention policies

### **Audit & Monitoring:**
- Log all API calls
- Monitor for suspicious activity
- Implement rate limiting
- Set up alerts for failures

## 🚨 **Troubleshooting**

### **Common Issues:**

1. **API Rate Limiting:**
   - Implement exponential backoff
   - Use multiple API keys
   - Cache responses appropriately

2. **Network Timeouts:**
   - Increase timeout values
   - Implement retry logic
   - Use connection pooling

3. **Data Accuracy:**
   - Validate API responses
   - Implement data quality checks
   - Add fallback mechanisms

### **Support Contacts:**
- **NSDL:** support@nsdl.co.in
- **UIDAI:** help@uidai.gov.in
- **CIBIL:** support@cibil.com
- **Account Aggregator:** support@accountaggregator.org

## 📈 **Performance Optimization**

### **Caching Strategy:**
```typescript
// Cache credit bureau data for 30 days
const creditBureauCache = new Map()
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000 // 30 days

async function getCachedCreditBureauData(pan: string) {
  const cached = creditBureauCache.get(pan)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data
  }
  
  const data = await externalAPIService.getCreditBureauData(pan)
  creditBureauCache.set(pan, { data, timestamp: Date.now() })
  return data
}
```

### **Batch Processing:**
```typescript
// Process multiple verifications in batch
async function batchVerifyPANs(panNumbers: string[]) {
  const batchSize = 10
  const results = []
  
  for (let i = 0; i < panNumbers.length; i += batchSize) {
    const batch = panNumbers.slice(i, i + batchSize)
    const batchResults = await Promise.all(
      batch.map(pan => externalAPIService.verifyPAN(pan))
    )
    results.push(...batchResults)
  }
  
  return results
}
```

## 🎉 **Success Metrics**

### **Key Performance Indicators:**
- **API Success Rate:** >99%
- **Response Time:** <2 seconds
- **Data Accuracy:** >95%
- **Cost per Verification:** <₹50
- **User Satisfaction:** >4.5/5

### **Monitoring Dashboard:**
- Real-time API health
- Success/failure rates
- Response times
- Cost tracking
- Error alerts

---

## 📞 **Support & Resources**

### **Documentation:**
- [RBI Guidelines for Digital Lending](https://rbi.org.in)
- [UIDAI API Documentation](https://uidai.gov.in)
- [Account Aggregator Framework](https://accountaggregator.org)

### **Community:**
- Join fintech developer communities
- Attend API provider events
- Network with other lending platforms

### **Training:**
- API integration workshops
- Compliance training
- Security best practices

---

**Note:** This guide provides a comprehensive framework for external API integration. Actual implementation may vary based on specific API provider requirements and regulatory compliance needs. 