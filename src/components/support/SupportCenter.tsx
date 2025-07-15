'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How long does the loan approval process take?',
    answer: 'Our streamlined process typically takes 24-48 hours for initial approval. Once approved, disbursement usually happens within 2-3 business days.',
    category: 'Process'
  },
  {
    id: '2',
    question: 'What documents do I need to apply for a loan?',
    answer: 'You\'ll need identity proof (Aadhaar/PAN), address proof, income proof (salary slips/bank statements), and vehicle details. Our system will guide you through the document upload process.',
    category: 'Documents'
  },
  {
    id: '3',
    question: 'What is the minimum credit score required?',
    answer: 'Minimum credit score requirements vary by lender, typically ranging from 650-700. We work with multiple lenders to find the best option for your profile.',
    category: 'Eligibility'
  },
  {
    id: '4',
    question: 'Can I apply for a loan if I\'m self-employed?',
    answer: 'Yes, we support self-employed individuals. You\'ll need to provide business registration documents, bank statements, and income tax returns.',
    category: 'Eligibility'
  },
  {
    id: '5',
    question: 'What are the processing fees?',
    answer: 'Processing fees vary by lender and loan amount, typically ranging from ₹1,000 to ₹5,000. The exact amount will be shown during the application process.',
    category: 'Fees'
  },
  {
    id: '6',
    question: 'How do I track my application status?',
    answer: 'You can track your application status in real-time through your dashboard. We also send SMS and email updates at each stage.',
    category: 'Process'
  },
  {
    id: '7',
    question: 'What happens if my loan is rejected?',
    answer: 'If one lender rejects your application, we automatically submit it to other lenders in our network. We\'ll also provide feedback on why it was rejected.',
    category: 'Process'
  },
  {
    id: '8',
    question: 'Can I prepay my loan?',
    answer: 'Yes, most lenders allow prepayment after 12 months. Prepayment charges typically range from 2-4% of the outstanding amount.',
    category: 'Repayment'
  }
];

const categories = ['All', 'Process', 'Documents', 'Eligibility', 'Fees', 'Repayment'];

export default function SupportCenter() {
  const [activeTab, setActiveTab] = useState('faq');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const filteredFaqs = selectedCategory === 'All' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/support/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      if (response.ok) {
        toast({
          title: 'Message Sent',
          description: 'We\'ll get back to you within 24 hours.',
        });
        setContactForm({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Support Center
        </h1>
        <p className="text-gray-600">
          Get help with your loan application and find answers to common questions
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-8">
        <button
          onClick={() => setActiveTab('faq')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'faq'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          FAQ
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'contact'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Contact Support
        </button>
        <button
          onClick={() => setActiveTab('tutorials')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'tutorials'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Video Tutorials
        </button>
      </div>

      {/* FAQ Section */}
      {activeTab === 'faq' && (
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ List */}
          <div className="space-y-4">
            {filteredFaqs.map(faq => (
              <div key={faq.id} className="bg-white rounded-lg shadow border">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedFaq === faq.id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {expandedFaq === faq.id && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Contact Support Section */}
      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Contact Support</h2>
            <p className="text-gray-600 mb-6">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Email Support</p>
                  <p className="text-gray-600">support@financehub.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Phone Support</p>
                  <p className="text-gray-600">1800-123-4567 (Mon-Fri, 9 AM-6 PM)</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Live Chat</p>
                  <p className="text-gray-600">Available 24/7</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Send us a message</h3>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <Input
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <Input
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject *
                </label>
                <Input
                  value={contactForm.subject}
                  onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                  required
                  placeholder="Brief description of your issue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Describe your issue in detail..."
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Send Message
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Video Tutorials Section */}
      {activeTab === 'tutorials' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Video Tutorials</h2>
          <p className="text-gray-600 mb-6">
            Learn how to use our platform with these helpful video guides.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Getting Started',
                description: 'Learn the basics of creating your first loan application',
                duration: '3:45',
                thumbnail: '/tutorials/getting-started.jpg'
              },
              {
                title: 'Document Upload',
                description: 'Step-by-step guide to uploading required documents',
                duration: '5:20',
                thumbnail: '/tutorials/document-upload.jpg'
              },
              {
                title: 'Application Tracking',
                description: 'How to track your application status in real-time',
                duration: '2:30',
                thumbnail: '/tutorials/tracking.jpg'
              },
              {
                title: 'Lender Selection',
                description: 'Understanding different lenders and their requirements',
                duration: '4:15',
                thumbnail: '/tutorials/lender-selection.jpg'
              },
              {
                title: 'Common Issues',
                description: 'Troubleshooting common application problems',
                duration: '6:10',
                thumbnail: '/tutorials/troubleshooting.jpg'
              },
              {
                title: 'Mobile App Guide',
                description: 'Using our mobile application for on-the-go access',
                duration: '3:55',
                thumbnail: '/tutorials/mobile-app.jpg'
              }
            ].map((tutorial, index) => (
              <div key={index} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="aspect-video bg-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-500">{tutorial.duration}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{tutorial.title}</h3>
                  <p className="text-sm text-gray-600">{tutorial.description}</p>
                  <Button className="mt-3 w-full" variant="outline">
                    Watch Video
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 