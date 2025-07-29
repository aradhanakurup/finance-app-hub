import { NextRequest, NextResponse } from 'next/server'
import { signzyDataEnhancement } from '@/services/signzyDataEnhancement'

export async function POST(req: NextRequest) {
  try {
    const applicationData = await req.json()

    // Validate required fields
    if (!applicationData.personalInfo?.pan || !applicationData.personalInfo?.aadhaar) {
      return NextResponse.json(
        { error: 'PAN and Aadhaar are required for verification' },
        { status: 400 }
      )
    }

    // Enhance application data with Signzy verification
    const enhancedData = await signzyDataEnhancement.enhanceApplicationData(applicationData)

    return NextResponse.json({
      success: true,
      data: enhancedData,
      message: 'Application data enhanced successfully'
    })
  } catch (error) {
    console.error('Error enhancing application data:', error)
    return NextResponse.json(
      { error: 'Failed to enhance application data' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve enhanced data for an application
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const applicationId = searchParams.get('applicationId')

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      )
    }

    // In a real application, you would fetch the application data from database
    // For now, we'll return a mock response
    const mockApplicationData = {
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '9876543210',
        aadhaar: '123412341234',
        pan: 'ABCDE1234F',
        dateOfBirth: '1990-01-01',
        address: {
          street: '123 Main Street',
          city: 'Mumbai',
          state: 'Maharashtra',
          pincode: '400001'
        }
      },
      employment: {
        employmentType: 'SALARIED',
        companyName: 'Tech Corp',
        designation: 'Software Engineer',
        monthlyIncome: 60000,
        experience: 5
      },
      expenses: {
        rent: 15000,
        utilities: 5000,
        food: 8000,
        transportation: 3000,
        healthcare: 2000,
        other: 5000
      },
      vehicle: {
        make: 'Maruti',
        model: 'Swift',
        year: 2024,
        variant: 'ZX',
        price: 800000,
        downPayment: 200000,
        loanAmount: 600000,
        tenure: 60
      },
      income: {
        monthlyIncome: 60000,
        existingEmis: 5000,
        bankAccount: {
          bankName: 'HDFC Bank',
          accountNumber: '1234567890',
          accountId: 'ACC123456',
          consentHandle: 'CONSENT123'
        }
      }
    }

    const enhancedData = await signzyDataEnhancement.enhanceApplicationData(mockApplicationData)

    return NextResponse.json({
      success: true,
      data: enhancedData,
      message: 'Enhanced application data retrieved successfully'
    })
  } catch (error) {
    console.error('Error retrieving enhanced application data:', error)
    return NextResponse.json(
      { error: 'Failed to retrieve enhanced application data' },
      { status: 500 }
    )
  }
} 