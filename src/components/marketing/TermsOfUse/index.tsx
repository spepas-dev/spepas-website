import React from 'react';
import Breadcrumb from '../Common/Breadcrumb';

const TermsOfUse: React.FC = () => {
  const sections = [
    {
      title: '1. General Overview',
      content: (
        <p>
          SpePas provides an online marketplace where independent sellers list
          auto parts for buyers. We don’t manufacture, own, or inspect products—
          we simply facilitate transactions between buyers and sellers.
        </p>
      )
    },
    {
      title: '2. User Accounts & Responsibilities',
      content: (
        <>
          <h4 className="font-medium">2.1 Account Creation</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>You must provide accurate info and be 18+ (or have consent).</li>
          </ul>
          <h4 className="font-medium mt-4">2.2 Account Security</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Keep your credentials secure and report unauthorized access.</li>
          </ul>
        </>
      )
    },
    {
      title: '3. Buying on SpePas',
      content: (
        <>
          <h4 className="font-medium">3.1 Order Process</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Placing an order is a binding agreement—verify specs first.</li>
          </ul>
          <h4 className="font-medium mt-4">3.2 Payments & Fees</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>We process Mobile Money, bank transfers, etc.; fees may apply.</li>
          </ul>
          <h4 className="font-medium mt-4">3.3 Delivery & Inspection</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Inspect on delivery and report issues within 24–48 hrs.</li>
          </ul>
          <h4 className="font-medium mt-4">3.4 Returns & Exchanges</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Exchanges preferred; refunds only for seller errors.</li>
          </ul>
        </>
      )
    },
    {
      title: '4. Selling on SpePas',
      content: (
        <>
          <h4 className="font-medium">4.1 Seller Responsibilities</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Accurate descriptions, clear images, correct pricing.</li>
            <li>No counterfeit, stolen, or illegal parts.</li>
            <li>Respond promptly to orders and inquiries.</li>
          </ul>
          <h4 className="font-medium mt-4">4.2 Fulfillment & Shipping</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Timely delivery required; inform us if you can’t fulfill.</li>
          </ul>
          <h4 className="font-medium mt-4">4.3 Disputes & Returns</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Comply with our Return Policy; negligent sellers may face penalties.</li>
          </ul>
        </>
      )
    },
    {
      title: '5. Prohibited Activities',
      content: (
        <ul className="list-disc list-inside space-y-1">
          <li>No listing of counterfeit, stolen, or hazardous goods.</li>
          <li>No fraudulent payments or scams.</li>
          <li>No review manipulation or user harassment.</li>
        </ul>
      )
    },
    {
      title: '6. Dispute Resolution',
      content: (
        <p>
          We encourage amicable resolution via Customer Support. If needed,
          SpePas will decide based on available evidence.
        </p>
      )
    },
    {
      title: '7. Limitation of Liability',
      content: (
        <ul className="list-disc list-inside space-y-1">
          <li>
            SpePas is not liable for disputes or damages between buyers & sellers.
          </li>
          <li>
            We do not guarantee product quality, safety, or legality.
          </li>
        </ul>
      )
    },
    {
      title: '8. Changes to Terms',
      content: (
        <p>
          We may update these terms periodically; using SpePas after updates
          means you accept them.
        </p>
      )
    },
    {
      title: '9. Contact Information',
      content: (
        <p>
          Questions? Email us at{' '}
          <a href="mailto:support@spepas.com" className="text-indigo-600 hover:underline">
            support@spepas.com
          </a>.
        </p>
      )
    }
  ];

  return (
    <>
      <Breadcrumb title="Terms of Use" pages={['Shop', 'Terms of Use']} />

      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <header className="text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-indigo-600">
              SpePas Terms of Use
            </h1>
            <p className="text-gray-700 sm:text-lg">
              By using SpePas you agree to these rules. Please read them carefully.
            </p>
          </header>

          {/* Sections */}
          {sections.map((sec, idx) => (
            <article
              key={idx}
              className="bg-white rounded-lg shadow-md p-6 sm:p-8 space-y-4"
            >
              <h2 className="text-xl sm:text-2xl font-semibold text-indigo-700">
                {sec.title}
              </h2>
              <div className="prose prose-indigo max-w-none text-gray-700">
                {sec.content}
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
};

export default TermsOfUse;
