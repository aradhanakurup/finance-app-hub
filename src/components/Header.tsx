export function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">🚗</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Indian Auto Finance Hub</h1>
              <p className="text-sm text-gray-600">RBI Compliant Digital Lending Platform</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
              Home
            </a>
            <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
              About
            </a>
            <a href="#" className="text-gray-600 hover:text-green-600 transition-colors">
              Contact
            </a>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Dealer Login
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
} 