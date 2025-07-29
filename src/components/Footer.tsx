import { Fin5Logo } from './Fin5Logo'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <Fin5Logo size="md" showTagline={true} variant="white" />
            </div>
            <p className="text-gray-400 mb-4">
              Streamline your financing process with leading Indian banks and NBFCs. Finance. Fast. Five minutes flat.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">🏦</span>
              </div>
              <div className="text-xs text-gray-400">
                <p>RBI Registered</p>
                <p>KYC Compliant</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Apply for Loan</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Dealer Portal</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Track Application</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">RBI Guidelines</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <div className="text-gray-400 space-y-2">
              <p>📧 akurup@astrovanta.tech</p>
              <p>📞 +91 1800-123-4567</p>
              <p>📱 WhatsApp: +91 7760997315</p>
              <p>📍 Bangalore, Karnataka, India</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center md:text-left">
            <div className="text-gray-400">
              <p>&copy; 2025 Fin5. All rights reserved.</p>
            </div>
            <div className="text-gray-400 text-sm">
              <p>RBI Registered | KYC Compliant | Data Protection Compliant</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 