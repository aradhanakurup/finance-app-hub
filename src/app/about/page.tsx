'use client';

import React from 'react';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Fin5Logo } from '../../components/Fin5Logo';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="mb-6">
              <Fin5Logo size="lg" showTagline={true} />
            </div>
            <h1 className="text-4xl font-bold text-blue-900 mb-4">
              About Fin5
            </h1>
            <p className="text-xl text-blue-700 mb-6">
              From "I Want a Loan" to "Approved" – In Just 5 Minutes.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Welcome to Fin5, the smartest way to get your loan approved. We're not just a loan application. 
              We're your financial wellness partner, built for speed, trust, and complete RBI compliance.
            </p>
          </div>

          {/* Why Fin5 Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">🚀 Why Fin5?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">⏱️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Fast</h3>
                  <p className="text-gray-600">Get from interest to approval in under 5 minutes.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">🧠</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Smart</h3>
                  <p className="text-gray-600">AI-driven risk assessment and document checks.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">🛡️</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Secure</h3>
                  <p className="text-gray-600">Built on RBI-grade infrastructure with full data privacy.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">📊</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Comprehensive</h3>
                  <p className="text-gray-600">A 360° check on your financial health, not just credit score.</p>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">💡 How It Works</h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Start with a few taps</h3>
                  <p className="text-gray-600">No lengthy forms.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">We connect the dots</h3>
                  <p className="text-gray-600">Using your PAN, bank info, and KYC.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Decision in minutes</h3>
                  <p className="text-gray-600">Lenders get a verified, risk-scored, ready-to-go profile.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Who We Help Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">👥 Who We Help</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl">👤</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Customers</h3>
                <p className="text-gray-600 text-sm">Get fair, fast loan access with zero paperwork hassle.</p>
              </div>
              
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl">🏦</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Lenders & NBFCs</h3>
                <p className="text-gray-600 text-sm">Underwrite smarter, faster, and with full compliance.</p>
              </div>
              
              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-xl">⚡</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Fintechs</h3>
                <p className="text-gray-600 text-sm">Plug into our APIs to supercharge your onboarding.</p>
              </div>
            </div>
          </div>

          {/* Secure by Design Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">🔐 Secure by Design</h2>
            <p className="text-gray-600 mb-6">
              We partner with industry leaders like Signzy, Perfios, and RBI-regulated systems to ensure:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700">Full data consent workflows</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700">AES-256 encrypted transactions</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <span className="text-gray-700">Compliance with RBI's Digital Lending Guidelines</span>
              </div>
            </div>
          </div>

          {/* Our Promise Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 mb-8 text-white">
            <h2 className="text-2xl font-bold mb-4">🤝 Our Promise</h2>
            <p className="text-lg leading-relaxed">
              We believe in speed without shortcuts, automation without compromise, and finance without friction.
            </p>
          </div>

          {/* Get in Touch Section */}
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">📬 Get in Touch</h2>
            <p className="text-gray-600 mb-6">
              Got questions, feedback or partnership ideas?
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-blue-600 text-xl">📩</span>
                  <div>
                    <p className="font-semibold text-gray-900">Email</p>
                    <a href="mailto:support@fin5.in" className="text-blue-600 hover:text-blue-700">
                      support@fin5.in
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-blue-600 text-xl">💬</span>
                  <div>
                    <p className="font-semibold text-gray-900">WhatsApp Chat</p>
                    <a href="https://wa.me/917760997315" className="text-blue-600 hover:text-blue-700">
                      Tap here
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-3">🔗 Follow us:</p>
                <div className="flex space-x-4">
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">LinkedIn</a>
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Instagram</a>
                  <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">Twitter</a>
                </div>
              </div>
            </div>
          </div>

          {/* Legal & Policies Section */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">🔍 Legal & Policies</h2>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline">
                Privacy Policy
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline">
                Terms of Use
              </a>
              <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline">
                RBI Compliance Statement
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 