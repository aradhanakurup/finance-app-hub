"use client"

interface ReviewStepProps {
  applicationData: any
  onSubmit: () => void
  isSubmitting: boolean
}

export function ReviewStep({ applicationData, onSubmit, isSubmitting }: ReviewStepProps) {
  const formatCurrency = (amount: string) => {
    if (!amount) return 'Not provided'
    const cleaned = amount.replace(/[^\d]/g, '')
    if (cleaned) {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
      }).format(parseInt(cleaned))
    }
    return amount
  }

  const formatDate = (date: string) => {
    if (!date) return 'Not provided'
    return new Date(date).toLocaleDateString('en-IN')
  }

  const maskAadhaar = (aadhaar: string) => {
    if (!aadhaar) return 'Not provided'
    return aadhaar.replace(/(\d{4})-(\d{4})-(\d{4})/, '****-****-$3')
  }

  const maskPAN = (pan: string) => {
    if (!pan) return 'Not provided'
    return pan.replace(/(\w{5})(\w{4})(\w{1})/, '$1****$3')
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Application</h2>
      
      <div className="space-y-6">
        {/* Personal Information */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information (KYC)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Name:</span>
              <p className="text-gray-900">
                {applicationData.personalInfo?.firstName} {applicationData.personalInfo?.lastName}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Email:</span>
              <p className="text-gray-900">{applicationData.personalInfo?.email}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Mobile:</span>
              <p className="text-gray-900">{applicationData.personalInfo?.mobileNumber}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Alternate Mobile:</span>
              <p className="text-gray-900">{applicationData.personalInfo?.alternateMobile || 'Not provided'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Date of Birth:</span>
              <p className="text-gray-900">{formatDate(applicationData.personalInfo?.dateOfBirth)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Gender:</span>
              <p className="text-gray-900">{applicationData.personalInfo?.gender}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Marital Status:</span>
              <p className="text-gray-900">{applicationData.personalInfo?.maritalStatus}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Father&apos;s/Husband&apos;s Name:</span>
              <p className="text-gray-900">{applicationData.personalInfo?.fatherHusbandName}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Aadhaar Number:</span>
              <p className="text-gray-900">{maskAadhaar(applicationData.personalInfo?.aadhaarNumber)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">PAN Number:</span>
              <p className="text-gray-900">{maskPAN(applicationData.personalInfo?.panNumber)}</p>
            </div>
            <div className="md:col-span-2">
              <span className="font-medium text-gray-700">Address:</span>
              <p className="text-gray-900">
                {applicationData.personalInfo?.houseNumber}, {applicationData.personalInfo?.street}, {applicationData.personalInfo?.area}, {applicationData.personalInfo?.city}, {applicationData.personalInfo?.state} {applicationData.personalInfo?.pinCode}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Time at Address:</span>
              <p className="text-gray-900">{applicationData.personalInfo?.timeAtAddress}</p>
            </div>
          </div>
        </div>

        {/* Employment Information */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Employment Type:</span>
              <p className="text-gray-900">{applicationData.employment?.employmentType}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Company Type:</span>
              <p className="text-gray-900">{applicationData.employment?.companyType}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Employer:</span>
              <p className="text-gray-900">{applicationData.employment?.employerName}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Job Title:</span>
              <p className="text-gray-900">{applicationData.employment?.jobTitle}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Department:</span>
              <p className="text-gray-900">{applicationData.employment?.department || 'Not provided'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Employee ID:</span>
              <p className="text-gray-900">{applicationData.employment?.employeeId || 'Not provided'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Start Date:</span>
              <p className="text-gray-900">{formatDate(applicationData.employment?.startDate)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Work Experience:</span>
              <p className="text-gray-900">
                {applicationData.employment?.workExperienceYears} years, {applicationData.employment?.workExperienceMonths} months
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Monthly Income:</span>
              <p className="text-gray-900">{formatCurrency(applicationData.employment?.monthlyIncome)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Annual Income:</span>
              <p className="text-gray-900">{formatCurrency(applicationData.employment?.annualIncome)}</p>
            </div>
            <div className="md:col-span-2">
              <span className="font-medium text-gray-700">Office Address:</span>
              <p className="text-gray-900">
                {applicationData.employment?.officeAddress}, {applicationData.employment?.officeCity}, {applicationData.employment?.officeState} {applicationData.employment?.officePinCode}
              </p>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Bank:</span>
              <p className="text-gray-900">{applicationData.income?.bankName}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">IFSC Code:</span>
              <p className="text-gray-900">{applicationData.income?.ifscCode}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Branch:</span>
              <p className="text-gray-900">{applicationData.income?.branchName}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Account Type:</span>
              <p className="text-gray-900">{applicationData.income?.accountType}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Additional Income:</span>
              <p className="text-gray-900">{formatCurrency(applicationData.income?.additionalIncome)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Monthly Rent/Mortgage:</span>
              <p className="text-gray-900">{formatCurrency(applicationData.income?.monthlyRent)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Property Ownership:</span>
              <p className="text-gray-900">{applicationData.income?.propertyOwnership}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Existing EMIs:</span>
              <p className="text-gray-900">{formatCurrency(applicationData.income?.existingEMIs)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Credit Card Limit:</span>
              <p className="text-gray-900">{formatCurrency(applicationData.income?.creditCardLimit)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Credit Card Outstanding:</span>
              <p className="text-gray-900">{formatCurrency(applicationData.income?.creditCardOutstanding)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Monthly Family Income:</span>
              <p className="text-gray-900">{formatCurrency(applicationData.income?.monthlyFamilyIncome)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Other Debts:</span>
              <p className="text-gray-900">{formatCurrency(applicationData.income?.otherDebts)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Credit Score:</span>
              <p className="text-gray-900">{applicationData.income?.creditScore}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Bank Statements:</span>
              <p className="text-gray-900">{applicationData.income?.bankStatementMonths} months</p>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle & Loan Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-700">Vehicle:</span>
              <p className="text-gray-900">
                {applicationData.vehicle?.year} {applicationData.vehicle?.make} {applicationData.vehicle?.model} {applicationData.vehicle?.variant}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Fuel Type:</span>
              <p className="text-gray-900">{applicationData.vehicle?.fuelType}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Transmission:</span>
              <p className="text-gray-900">{applicationData.vehicle?.transmission}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">VIN:</span>
              <p className="text-gray-900">{applicationData.vehicle?.vin}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Engine Number:</span>
              <p className="text-gray-900">{applicationData.vehicle?.engineNumber}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Registration:</span>
              <p className="text-gray-900">{applicationData.vehicle?.registrationNumber || 'Not provided'}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Mileage:</span>
              <p className="text-gray-900">{applicationData.vehicle?.mileage} km</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Condition:</span>
              <p className="text-gray-900">{applicationData.vehicle?.vehicleCondition}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Vehicle Price:</span>
              <p className="text-gray-900">{formatCurrency(applicationData.vehicle?.vehiclePrice)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Down Payment:</span>
              <p className="text-gray-900">{formatCurrency(applicationData.vehicle?.downPayment)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Loan Amount:</span>
              <p className="text-gray-900">{formatCurrency(applicationData.vehicle?.loanAmount)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Loan Tenure:</span>
              <p className="text-gray-900">{applicationData.vehicle?.loanTenure} months</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Interest Rate:</span>
              <p className="text-gray-900">{applicationData.vehicle?.interestRate}% p.a.</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Processing Fee:</span>
              <p className="text-gray-900">{formatCurrency(applicationData.vehicle?.processingFee)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Insurance:</span>
              <p className="text-gray-900">{formatCurrency(applicationData.vehicle?.insuranceAmount)}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">RTO Charges:</span>
              <p className="text-gray-900">{formatCurrency(applicationData.vehicle?.rtoCharges)}</p>
            </div>
          </div>
        </div>

        {/* References */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">References</h3>
          <div className="space-y-4">
            {applicationData.references?.references?.map((ref: any, index: number) => (
              <div key={index} className="border-l-4 border-green-500 pl-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <p className="text-gray-900">{ref.name}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Reference Type:</span>
                    <p className="text-gray-900">{ref.referenceType}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Relationship:</span>
                    <p className="text-gray-900">{ref.relationship}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Occupation:</span>
                    <p className="text-gray-900">{ref.occupation}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <p className="text-gray-900">{ref.phone}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-900">{ref.email || 'Not provided'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <span className="font-medium text-gray-700">Address:</span>
                    <p className="text-gray-900">{ref.address || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Document Upload Status */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Upload Status</h3>
          <div className="space-y-4">
            {applicationData.documents?.uploadedDocuments ? (
              Object.entries(applicationData.documents.uploadedDocuments).map(([docType, files]: [string, any]) => (
                <div key={docType} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-900 capitalize">
                      {docType.replace(/-/g, ' ')}
                    </h4>
                    <span className="text-sm text-gray-500">
                      {files.length} file{files.length !== 1 ? 's' : ''} uploaded
                    </span>
                  </div>
                  <div className="space-y-2">
                    {files.map((file: any, index: number) => (
                      <div key={file.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            file.status === 'verified' ? 'text-green-600 bg-green-50' :
                            file.status === 'uploading' ? 'text-blue-600 bg-blue-50' :
                            file.status === 'error' ? 'text-red-600 bg-red-50' :
                            'text-gray-600 bg-gray-50'
                          }`}>
                            {file.status === 'verified' ? '✅' :
                             file.status === 'uploading' ? '⏳' :
                             file.status === 'error' ? '❌' : '📄'} {file.status}
                          </span>
                          <span className="text-gray-600">{file.file.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {(file.file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📄</div>
                <p>No documents uploaded yet</p>
                <p className="text-sm">Please complete the document upload step</p>
              </div>
            )}
            
            {applicationData.documents?.overallProgress !== undefined && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-blue-900">Overall Progress</span>
                  <span className="text-sm text-blue-700">{applicationData.documents.overallProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${applicationData.documents.overallProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms and Conditions</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p>By submitting this application, you agree to the following:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>All information provided is accurate and complete as per RBI guidelines</li>
              <li>You authorize us to verify the information through KYC processes</li>
              <li>You consent to receive communications regarding your application</li>
              <li>You understand this is a credit application and may affect your credit score</li>
              <li>You agree to comply with all applicable Indian laws and regulations</li>
              <li>You authorize us to share information with credit bureaus and regulatory authorities</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>Application Submission:</strong> After submission, you will receive a confirmation email and SMS. 
          Our team will review your application within 24-48 hours and contact you for further processing.
        </p>
      </div>
    </div>
  )
} 