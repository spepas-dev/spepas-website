import React from 'react';
import { Link } from 'react-router-dom';

import Breadcrumb from '../Common/Breadcrumb';

const RefundPolicy: React.FC = () => {
  const sections = [
    {
      title: '1. Eligibility for Returns & Exchanges',
      content: (
        <ol className="list-decimal list-inside space-y-2 text-gray-700">
          <li>
            <strong>Timeframe:</strong> Initiate within 24–48 hrs of delivery; verify items on receipt.
          </li>
          <li>
            <strong>Condition:</strong> Unused, original packaging, resalable condition required.
          </li>
          <li>
            <strong>Exceptions:</strong> Electrical, custom, and special-import parts only if defective.
          </li>
          <li>
            <strong>Proof:</strong> Valid receipt or order confirmation.
          </li>
        </ol>
      )
    },
    {
      title: '2. Return & Exchange Process',
      content: (
        <>
          <p className="font-medium">Initiate Return:</p>
          <ul className="list-disc list-inside mb-4 text-gray-700">
            <li>Request via app or website within 48 hrs of delivery.</li>
            <li>Supply reason + evidence (e.g. photos of defects).</li>
          </ul>
          <p className="font-medium">Inspection & Approval:</p>
          <ul className="list-disc list-inside text-gray-700">
            <li>We inspect returned items.</li>
            <li>Approved exchanges prioritized; refunds only if exchange not possible.</li>
          </ul>
        </>
      )
    },
    {
      title: '3. Exchange & Refund Policy',
      content: (
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            <strong>Exchanges Preferred:</strong> We’ll replace or provide equivalent item.
          </li>
          <li>
            <strong>Refunds Rare:</strong> Only if seller error (defective/incorrect item).
          </li>
          <li>
            <strong>Shipping:</strong> You cover return shipping unless it’s our fault.
          </li>
        </ul>
      )
    },
    {
      title: '4. Customer History & Priority',
      content: (
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            <strong>Regulars (6+ months):</strong> Faster resolution and priority handling.
          </li>
          <li>
            <strong>New/One-Time:</strong> May require extra verification (police report for high-value).
          </li>
        </ul>
      )
    },
    {
      title: '5. Dispute Resolution',
      content: (
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Case-by-case review by SpePas Admin.</li>
          <li>Fraud suspicion may lead to denial of return.</li>
        </ul>
      )
    },
    {
      title: '6. Contact Support',
      content: (
        <p className="text-gray-700">
          Questions? Reach us via the app or email{' '}
          <a href="mailto:support@spepas.com" className="text-indigo-600 hover:underline">
            support@spepas.com
          </a>
          .
        </p>
      )
    },
    {
      title: '7. Policy Changes',
      content: <p className="text-gray-700 italic">We may update this policy anytime without notice.</p>
    }
  ];

  return (
    <>
      <Breadcrumb title="Return Policy" pages={['Shop', 'Return Policy']} />

      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Header */}
          <header className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-indigo-600">SpePas Return Policy</h1>
            <p className="text-gray-700 sm:text-lg">Not satisfied? Here’s how to return or exchange your auto parts.</p>
          </header>

          {/* Image */}
          <div className="rounded-lg overflow-hidden mb-6">
            <img src="/images/images/refund.png" alt="Return Policy" className="w-full h-auto object-cover" />
          </div>

          {/* Sections */}
          {sections.map((sec, i) => (
            <article key={i} className="bg-white rounded-lg shadow-md p-6 sm:p-8 space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold text-indigo-700">{sec.title}</h2>
              <div className="prose prose-indigo max-w-none">{sec.content}</div>
            </article>
          ))}

          {/* Contact Support Button */}
          <div className="text-center mt-8">
            <Link
              to="/contact"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default RefundPolicy;
