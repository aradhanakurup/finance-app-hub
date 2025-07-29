"use client"

interface ExpensesStepProps {
  data: any
  onUpdate: (data: any) => void
}

export function ExpensesStep({ data, onUpdate }: ExpensesStepProps) {
  const handleInputChange = (field: string, value: number) => {
    onUpdate({
      ...data,
      [field]: value
    })
  }

  const totalExpenses = (
    (data?.rent || 0) +
    (data?.utilities || 0) +
    (data?.food || 0) +
    (data?.transportation || 0) +
    (data?.healthcare || 0) +
    (data?.other || 0)
  )

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Monthly Expenses</h2>
      <p className="text-gray-600 mb-6">
        Please provide your monthly expenses to help us calculate your loan eligibility and EMI affordability.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rent/Housing (₹)</label>
          <input
            type="number"
            value={data?.rent || ''}
            onChange={(e) => handleInputChange('rent', Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Utilities (₹)</label>
          <input
            type="number"
            value={data?.utilities || ''}
            onChange={(e) => handleInputChange('utilities', Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="0"
          />
          <p className="text-xs text-gray-500 mt-1">Electricity, water, gas, internet, etc.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Food & Groceries (₹)</label>
          <input
            type="number"
            value={data?.food || ''}
            onChange={(e) => handleInputChange('food', Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Transportation (₹)</label>
          <input
            type="number"
            value={data?.transportation || ''}
            onChange={(e) => handleInputChange('transportation', Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="0"
          />
          <p className="text-xs text-gray-500 mt-1">Fuel, public transport, maintenance, etc.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Healthcare (₹)</label>
          <input
            type="number"
            value={data?.healthcare || ''}
            onChange={(e) => handleInputChange('healthcare', Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="0"
          />
          <p className="text-xs text-gray-500 mt-1">Medical expenses, insurance, medicines, etc.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Other Expenses (₹)</label>
          <input
            type="number"
            value={data?.other || ''}
            onChange={(e) => handleInputChange('other', Number(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="0"
          />
          <p className="text-xs text-gray-500 mt-1">Entertainment, shopping, education, etc.</p>
        </div>
      </div>

      {/* Total Expenses Summary */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expense Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Rent/Housing:</span>
            <span className="font-medium">₹{(data?.rent || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Utilities:</span>
            <span className="font-medium">₹{(data?.utilities || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Food & Groceries:</span>
            <span className="font-medium">₹{(data?.food || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Transportation:</span>
            <span className="font-medium">₹{(data?.transportation || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Healthcare:</span>
            <span className="font-medium">₹{(data?.healthcare || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Other:</span>
            <span className="font-medium">₹{(data?.other || 0).toLocaleString()}</span>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-gray-900">Total Monthly Expenses:</span>
            <span className="text-blue-600">₹{totalExpenses.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Information Box */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Accurate expense information helps us provide better loan recommendations and calculate your EMI affordability more precisely. This information is used solely for loan eligibility assessment.
        </p>
      </div>
    </div>
  )
} 