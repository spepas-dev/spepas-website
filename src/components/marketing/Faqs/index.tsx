// src/pages/Faq.tsx
import React from 'react';
import Breadcrumb from '../Common/Breadcrumb';
import FAQItem from '@/components/marketing/Faqs/FAQItem'; // or wherever you keep FAQItem
import { Link } from 'react-router-dom';

const faqSections = [
  {
    heading: '1. General Questions',
    items: [
      {
        question: 'What is SpePas?',
        answer: (
          <p>
            SpePas is an online marketplace where buyers and sellers connect to trade auto parts securely and conveniently across West Africa.
          </p>
        )
      },
      {
        question: 'How does SpePas work?',
        answer: (
          <ul className="list-disc list-inside space-y-1">
            <li>Sellers list parts with photos, specs & pricing.</li>
            <li>Buyers browse, select, and pay via secure methods.</li>
            <li>Delivery is arranged; buyers verify within 24–48 hrs.</li>
          </ul>
        )
      },
      {
        question: 'Is SpePas available in my country?',
        answer: <p>Currently in Ghana; expanding across West Africa soon!</p>
      }
    ]
  },
  {
    heading: '2. Buying on SpePas',
    items: [
      {
        question: 'How do I place an order?',
        answer: (
          <ol className="list-decimal list-inside space-y-1">
            <li>Search by part name, brand, or model.</li>
            <li>Review details and click “Buy Now.”</li>
            <li>Choose payment method and confirm.</li>
            <li>Inspect delivery within 24–48 hrs.</li>
          </ol>
        )
      },
      {
        question: 'What payment methods are accepted?',
        answer: (
          <ul className="list-disc list-inside space-y-1">
            <li>Mobile Money (MTN, AirtelTigo, Vodafone Cash)</li>
            <li>Bank Transfer</li>
            <li>Other secure options</li>
          </ul>
        )
      },
      {
        question: 'Can I cancel an order after payment?',
        answer: <p>Only before shipment—once shipped, our Return Policy applies.</p>
      },
      {
        question: 'What if I receive the wrong or damaged item?',
        answer: (
          <ul className="list-disc list-inside space-y-1">
            <li>Report via app/website within 24–48 hrs.</li>
            <li>Provide clear photos/videos.</li>
            <li>If approved, you’ll get an exchange or credit.</li>
          </ul>
        )
      }
    ]
  },
  {
    heading: '3. Returns & Exchanges',
    items: [
      {
        question: "What's SpePas' return policy?",
        answer: (
          <ul className="list-disc list-inside space-y-1">
            <li>Initiate within 24–48 hrs of delivery.</li>
            <li>Item must be unused & in original packaging.</li>
            <li>Refunds only for seller errors with evidence.</li>
          </ul>
        )
      },
      {
        question: 'How do I return an item?',
        answer: (
          <ol className="list-decimal list-inside space-y-1">
            <li>Submit a return request in-app/website.</li>
            <li>Attach proof (photos/videos).</li>
            <li>We review & arrange an exchange or credit.</li>
          </ol>
        )
      },
      {
        question: 'Are all parts returnable?',
        answer: <p>No—electrical and installed items are final sale.</p>
      }
    ]
  },
  {
    heading: '4. Selling on SpePas',
    items: [
      {
        question: 'How do I list parts for sale?',
        answer: (
          <ol className="list-decimal list-inside space-y-1">
            <li>Create a seller account.</li>
            <li>Upload clear images & descriptions.</li>
            <li>Set price & delivery options.</li>
            <li>Respond promptly to buyers.</li>
          </ol>
        )
      },
      {
        question: 'What are the seller fees?',
        answer: <p>We charge a small commission per sale; details in your dashboard.</p>
      },
      {
        question: 'What if a buyer disputes?',
        answer: (
          <ul className="list-disc list-inside space-y-1">
            <li>We mediate with evidence from both sides.</li>
            <li>Accurate sellers are protected; at-fault sellers must refund.</li>
          </ul>
        )
      }
    ]
  },
  {
    heading: '5. Security & Fraud Prevention',
    items: [
      {
        question: 'How does SpePas protect users?',
        answer: (
          <ul className="list-disc list-inside space-y-1">
            <li>Secure payments to prevent fraud.</li>
            <li>Seller verification to reduce counterfeits.</li>
            <li>24–48 hr verification window for disputes.</li>
          </ul>
        )
      },
      {
        question: 'What if I suspect a scam?',
        answer: (
          <ul className="list-disc list-inside space-y-1">
            <li>Report via the app or support email immediately.</li>
            <li>Never share login details or pay off-platform.</li>
          </ul>
        )
      },
      {
        question: 'Does SpePas share my data?',
        answer: <p>No—see our Privacy Policy for full details.</p>
      }
    ]
  },
  {
    heading: '6. Technical & Support',
    items: [
      {
        question: 'How do I contact support?',
        answer: (
          <p>
            Email{' '}
            <a href="mailto:support@spepas.com" className="text-indigo-600 hover:underline">
              support@spepas.com
            </a>{' '}
            or call [Phone Number].
          </p>
        )
      },
      {
        question: 'I forgot my password—what now?',
        answer: <p>Use “Forgot Password” to reset via email or SMS.</p>
      },
      {
        question: 'Is there a mobile app?',
        answer: <p>Yes—download on Google Play or the App Store for the best experience.</p>
      }
    ]
  },
  {
    heading: '7. Policies & Terms',
    items: [
      {
        question: 'Where are the full policies?',
        answer: (
          <>
            <ul className="list-disc list-inside mb-4">
              <li><Link to="/return-policy" className="text-indigo-600 hover:underline">Return Policy</Link></li>
              <li><Link to="/terms-of-use" className="text-indigo-600 hover:underline">Terms of Use</Link></li>
              <li><Link to="/privacy-policy" className="text-indigo-600 hover:underline">Privacy Policy</Link></li>
            </ul>
            <p>By using SpePas you agree to all our policies.</p>
          </>
        )
      }
    ]
  }
];

const Faq: React.FC = () => (
  <>
    <Breadcrumb title="FAQ" pages={['Shop', 'FAQ']} />

    <section className="bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <header className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-indigo-600">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-700 sm:text-lg">
            Find quick answers to common questions about buying, selling, and using SpePas.
          </p>
        </header>

        {/* Illustration */}
        <div className="rounded-lg overflow-hidden">
          <img
            src="/images/images/faq.png"
            alt="FAQ"
            className="w-full h-auto object-cover"
          />
        </div>

        {/* FAQ Sections */}
        {faqSections.map((sec, idx) => (
          <article
            key={idx}
            className="bg-white rounded-lg shadow-md p-6 sm:p-8 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-indigo-700">
              {sec.heading}
            </h2>
            <div className="space-y-4">
              {sec.items.map((item, i) => (
                <FAQItem
                  key={i}
                  question={item.question}
                  answer={item.answer}
                />
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  </>
);

export default Faq;
