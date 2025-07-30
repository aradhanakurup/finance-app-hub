'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <div className="md:hidden">
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="w-full flex items-center justify-center px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
      >
        <svg 
          className={`w-5 h-5 mr-2 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
        {isOpen ? 'Close' : 'Menu'}
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-100 z-50">
          <div className="px-4 py-6 space-y-4">
            {/* Navigation Links */}
            <div className="space-y-2">
              <Link 
                href="/" 
                onClick={closeMenu}
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
              >
                Home
              </Link>
              <a 
                href="/prescreening" 
                onClick={closeMenu}
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
              >
                Quick Check
              </a>
              <a 
                href="/tracker" 
                onClick={closeMenu}
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
              >
                Track Applications
              </a>
              <a 
                href="/about" 
                onClick={closeMenu}
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
              >
                About
              </a>
              <a 
                href="/contact" 
                onClick={closeMenu}
                className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
              >
                Contact
              </a>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-2">
                <a 
                  href="/login" 
                  onClick={closeMenu}
                  className="block px-4 py-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium"
                >
                  Customer Login
                </a>
                <a 
                  href="/register" 
                  onClick={closeMenu}
                  className="block px-4 py-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium border border-blue-200"
                >
                  Customer Register
                </a>
                <a 
                  href="/lender/login" 
                  onClick={closeMenu}
                  className="block px-4 py-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium border border-blue-200"
                >
                  Lender Login
                </a>
                <a 
                  href="/dealer/login" 
                  onClick={closeMenu}
                  className="block px-4 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-all duration-200 font-medium text-center"
                >
                  Dealer Login
                </a>
              </div>
            </div>

            {/* Tagline */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Finance. Fast. Five minutes flat.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 