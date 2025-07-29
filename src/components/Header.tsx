import { Fin5Logo } from './Fin5Logo'
import { MobileNavigation } from './MobileNavigation'

export function Header() {
  return (
    <header className="bg-white shadow-lg border-b border-gray-100 relative">
      <div className="container mx-auto px-4 py-3">
        {/* Main Header */}
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-6">
            <Fin5Logo size="lg" />
            <div className="hidden lg:block">
              <p className="text-sm text-blue-700 font-medium">
                Streamline your financing process with leading Indian banks and NBFCs
              </p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <a 
              href="/" 
              className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
            >
              Home
            </a>
            <a 
              href="/prescreening" 
              className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
            >
              Quick Check
            </a>
            <a 
              href="/tracker" 
              className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
            >
              Track Applications
            </a>
            <a 
              href="/about" 
              className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
            >
              About
            </a>
            <a 
              href="/contact" 
              className="px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
            >
              Contact
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <a 
              href="/login" 
              className="hidden sm:block px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
            >
              Login
            </a>
            <a 
              href="/register" 
              className="hidden sm:block px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium border border-blue-200 hover:border-blue-300"
            >
              Register
            </a>
            <a 
              href="/lender/login" 
              className="hidden sm:block px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium border border-blue-200 hover:border-blue-300"
            >
              Lender Login
            </a>
            <a 
              href="/dealer/login" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-sm hover:shadow-md"
            >
              Dealer Login
            </a>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="mt-3">
          <MobileNavigation />
        </div>
      </div>
    </header>
  )
} 