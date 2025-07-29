/*
  Warnings:

  - Added the required column `userId` to the `Application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerificationToken" TEXT,
    "passwordResetToken" TEXT,
    "passwordResetExpires" DATETIME,
    "lastLoginAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Application" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "submittedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" DATETIME,
    "rejectedAt" DATETIME,
    "rejectionReason" TEXT,
    "approvedAmount" REAL,
    "interestRate" REAL,
    "processingFee" REAL,
    "totalAmount" REAL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "customerId" TEXT,
    CONSTRAINT "Application_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Application_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Application" ("approvedAmount", "approvedAt", "createdAt", "id", "interestRate", "processingFee", "rejectedAt", "rejectionReason", "status", "submittedAt", "totalAmount", "updatedAt") SELECT "approvedAmount", "approvedAt", "createdAt", "id", "interestRate", "processingFee", "rejectedAt", "rejectionReason", "status", "submittedAt", "totalAmount", "updatedAt" FROM "Application";
DROP TABLE "Application";
ALTER TABLE "new_Application" RENAME TO "Application";
CREATE TABLE "new_Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "applicationId" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "aadhaar" TEXT,
    "pan" TEXT,
    "dateOfBirth" DATETIME,
    "addressStreet" TEXT,
    "addressCity" TEXT,
    "addressState" TEXT,
    "addressPincode" TEXT,
    "employmentType" TEXT,
    "companyName" TEXT,
    "designation" TEXT,
    "monthlyIncome" REAL,
    "experience" INTEGER,
    "creditScore" INTEGER,
    "existingEmis" REAL,
    "bankName" TEXT,
    "accountNumber" TEXT,
    "ifscCode" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Customer" ("aadhaar", "accountNumber", "addressCity", "addressPincode", "addressState", "addressStreet", "applicationId", "bankName", "companyName", "createdAt", "creditScore", "dateOfBirth", "designation", "email", "employmentType", "existingEmis", "experience", "firstName", "id", "ifscCode", "lastName", "monthlyIncome", "pan", "phone", "updatedAt") SELECT "aadhaar", "accountNumber", "addressCity", "addressPincode", "addressState", "addressStreet", "applicationId", "bankName", "companyName", "createdAt", "creditScore", "dateOfBirth", "designation", "email", "employmentType", "existingEmis", "experience", "firstName", "id", "ifscCode", "lastName", "monthlyIncome", "pan", "phone", "updatedAt" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE UNIQUE INDEX "Customer_userId_key" ON "Customer"("userId");
CREATE UNIQUE INDEX "Customer_applicationId_key" ON "Customer"("applicationId");
CREATE UNIQUE INDEX "Customer_aadhaar_key" ON "Customer"("aadhaar");
CREATE UNIQUE INDEX "Customer_pan_key" ON "Customer"("pan");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
