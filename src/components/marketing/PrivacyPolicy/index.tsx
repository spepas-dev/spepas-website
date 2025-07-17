import React from 'react';
import Breadcrumb from '../Common/Breadcrumb';

const PrivacyPolicy: React.FC = () => (
  <>
    <Breadcrumb title="Privacy Policy" pages={['Shop', 'Privacy Policy']} />

    <section className="bg-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Intro */}
        <header className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-indigo-600">
            SpePas Privacy Policy
          </h1>
          <p className="text-gray-700 sm:text-lg">
            We’re committed to protecting your privacy and keeping our marketplace safe. Below is how we collect, use, and safeguard your data.
          </p>
        </header>

        {/* Sections */}
        {[
          {
            title: '1. Information We Collect',
            content: (
              <>
                <p>We gather:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>Personal Info:</strong> Name, email, phone, address from signup.</li>
                  <li><strong>Payment Data:</strong> Mobile Money or bank info for transactions.</li>
                  <li><strong>Activity Logs:</strong> Order history, browser/device metadata.</li>
                  <li><strong>Fraud Prevention:</strong> ID verifications & dispute reports.</li>
                </ul>
              </>
            )
          },
          {
            title: '2. How We Use Your Information',
            content: (
              <ul className="list-decimal list-inside space-y-2">
                <li>Execute buy/sell transactions securely.</li>
                <li>Detect and prevent fraud or policy violations.</li>
                <li>Send you order updates & platform news.</li>
                <li>Analyze usage to improve SpePas.</li>
              </ul>
            )
          },
          {
            title: '3. Data Security & Protection',
            content: (
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Encryption:</strong> All sensitive data in transit & at rest.</li>
                <li><strong>Access Control:</strong> Only authorized teams can view PII.</li>
                <li><strong>Monitoring:</strong> 24/7 fraud detection & incident response.</li>
              </ul>
            )
          },
          {
            title: '4. Fraud Prevention & Legal Compliance',
            content: (
              <ul className="list-disc list-inside space-y-2">
                <li>Adhere to West African finance laws & AML regulations.</li>
                <li>Comply with GDPR standards for global users.</li>
                <li>Share info with authorities when required by law.</li>
              </ul>
            )
          },
          {
            title: '5. User Rights & Data Control',
            content: (
              <ul className="list-disc list-inside space-y-2">
                <li>Access or update your data anytime.</li>
                <li>Request deletion (some records kept for legal needs).</li>
                <li>Opt-out of non-essential communications.</li>
              </ul>
            )
          },
          {
            title: '6. Third-Party Services & Links',
            content: (
              <p>
                We integrate payment and logistics partners—please review their privacy policies separately. SpePas is not responsible for third-party data practices.
              </p>
            )
          },
          {
            title: '7. Changes to This Policy',
            content: (
              <p>
                We may update this policy occasionally. Continued use of SpePas means you accept any updates.
              </p>
            )
          },
          {
            title: '8. Contact Us',
            content: (
              <p>
                Questions or concerns? Email{' '}
                <a href="mailto:support@spepas.com" className="text-indigo-600 hover:underline">
                  support@spepas.com
                </a>
                .
              </p>
            )
          }
        ].map((section, idx) => (
          <article
            key={idx}
            className="bg-white rounded-lg shadow-md p-6 sm:p-8 space-y-4"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-indigo-700">
              {section.title}
            </h2>
            <div className="prose prose-indigo max-w-none text-gray-700">
              {section.content}
            </div>
          </article>
        ))}
      </div>
    </section>
  </>
);

export default PrivacyPolicy;
