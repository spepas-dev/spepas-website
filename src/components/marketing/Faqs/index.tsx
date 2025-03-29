import React, { useState } from 'react';

import Breadcrumb from '../Common/Breadcrumb';

const FAQItem = ({ question, answer }: { question: string; answer: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-gray-300 pb-4 mb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex justify-between items-center w-full text-left focus:outline-none hover:text-blue-500 transition-colors"
      >
        <span className="text-lg font-medium text-[#4a36ec]">{question}</span>
        <span className="text-xl">{isOpen ? '-' : '+'}</span>
      </button>
      {isOpen && <div className="mt-2 text-gray-700 transition-all duration-300">{answer}</div>}
    </div>
  );
};

const Faq = () => {
  return (
    <>
      <Breadcrumb title={'FAQ'} pages={['FAQ']} />
      <section className="overflow-hidden py-10 bg-gray-2">
        <div className="max-w-[750px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {/* Header image */}
          <div className="rounded-[10px] overflow-hidden mb-7.5">
            <img
              className="rounded-[10px]"
              src="/images/images/faq.png" // Replace with your FAQ image path
              alt="Frequently Asked Questions"
              width={750}
              height={477}
            />
          </div>

          <div>
            <h2 className="font-medium text-[#4a36ec] text-xl lg:text-2xl xl:text-custom-4xl mb-6">
              SpePas Frequently Asked Questions (FAQ)
            </h2>
            <p className="mb-6 text-gray-700">
              Welcome to SpePas, your trusted auto parts marketplace in West Africa! Below are answers to common questions to help you
              navigate our platform smoothly.
            </p>

            {/* Section 1: General Questions */}
            <h3 className="font-medium text-[#4a36ec] text-lg xl:text-[26px] xl:leading-[34px] mb-4">1. General Questions</h3>
            <FAQItem
              question="1.1 What is SpePas?"
              answer={
                <p>
                  SpePas is an online marketplace where buyers and sellers connect to trade auto parts securely and conveniently across West
                  Africa.
                </p>
              }
            />
            <FAQItem
              question="1.2 How does SpePas work?"
              answer={
                <ul className="list-disc pl-6">
                  <li>Sellers list auto parts with descriptions and pricing.</li>
                  <li>Buyers browse and purchase parts based on their vehicle needs.</li>
                  <li>Payments are processed securely through Mobile Money, bank transfer, or other approved methods.</li>
                  <li>Delivery is arranged, and buyers must verify items within 24-48 hours.</li>
                </ul>
              }
            />
            <FAQItem
              question="1.3 Is SpePas available in my country?"
              answer={<p>SpePas primarily operates in Ghana and is expanding across West Africa. Stay tuned for updates!</p>}
            />

            {/* Section 2: Buying on SpePas */}
            <h3 className="font-medium text-[#4a36ec] text-lg xl:text-[26px] xl:leading-[34px] mb-4">2. Buying on SpePas</h3>
            <FAQItem
              question="2.1 How do I place an order?"
              answer={
                <ol className="list-decimal pl-6">
                  <li>Search for your auto part using filters like car brand, model, or part type.</li>
                  <li>Select your item, review details, and click Buy Now.</li>
                  <li>Choose a payment method and confirm the order.</li>
                  <li>Receive your item and verify within 24-48 hours.</li>
                </ol>
              }
            />
            <FAQItem
              question="2.2 What payment methods are accepted?"
              answer={
                <ul className="list-disc pl-6">
                  <li>Mobile Money (MTN, AirtelTigo, Vodafone Cash)</li>
                  <li>Bank Transfer</li>
                  <li>Other secure payment methods as available</li>
                </ul>
              }
            />
            <FAQItem
              question="2.3 Can I cancel an order after payment?"
              answer={<p>Orders can only be canceled before shipment. Once shipped, the return &amp; exchange policy applies.</p>}
            />
            <FAQItem
              question="2.4 What if I receive the wrong or damaged item?"
              answer={
                <ul className="list-disc pl-6">
                  <li>Report the issue within 24-48 hours via the SpePas app or website.</li>
                  <li>Provide clear images or videos for verification.</li>
                  <li>If eligible, you’ll receive an exchange or store credit.</li>
                </ul>
              }
            />

            {/* Section 3: Returns & Exchanges */}
            <h3 className="font-medium text-[#4a36ec] text-lg xl:text-[26px] xl:leading-[34px] mb-4">3. Returns &amp; Exchanges</h3>
            <FAQItem
              question="3.1 What is SpePas' return policy?"
              answer={
                <ul className="list-disc pl-6">
                  <li>Return request initiated within 24-48 hours of delivery.</li>
                  <li>Item must be unused and in original packaging.</li>
                  <li>Refunds are only issued if the seller is clearly at fault, with verified evidence.</li>
                </ul>
              }
            />
            <FAQItem
              question="3.2 How do I return an item?"
              answer={
                <ol className="list-decimal pl-6">
                  <li>Submit a return request via the app or website.</li>
                  <li>Provide proof (photos/videos) showing the issue.</li>
                  <li>SpePas reviews the request and, if approved, arranges an exchange or store credit.</li>
                </ol>
              }
            />
            <FAQItem
              question="3.3 Are all parts returnable?"
              answer={<p>No. Electrical parts and installed items are non-returnable. Always verify compatibility before purchase.</p>}
            />

            {/* Section 4: Selling on SpePas */}
            <h3 className="font-medium text-[#4a36ec] text-lg xl:text-[26px] xl:leading-[34px] mb-4">4. Selling on SpePas</h3>
            <FAQItem
              question="4.1 How do I list my auto parts for sale?"
              answer={
                <ol className="list-decimal pl-6">
                  <li>Create a seller account on the SpePas app or website.</li>
                  <li>Upload high-quality images and detailed product descriptions.</li>
                  <li>Set a fair price and choose delivery options.</li>
                  <li>Respond to buyer inquiries and fulfill orders promptly.</li>
                </ol>
              }
            />
            <FAQItem
              question="4.2 What are the seller fees?"
              answer={<p>SpePas may charge a small commission on successful sales. Fees vary based on category and volume.</p>}
            />
            <FAQItem
              question="4.3 What happens if a buyer disputes my item?"
              answer={
                <ul className="list-disc pl-6">
                  <li>SpePas will review the dispute and request evidence from both parties.</li>
                  <li>If you provided accurate details, you’re protected.</li>
                  <li>If found at fault, you may need to offer an exchange or refund.</li>
                </ul>
              }
            />

            {/* Section 5: Security & Fraud Prevention */}
            <h3 className="font-medium text-[#4a36ec] text-lg xl:text-[26px] xl:leading-[34px] mb-4">5. Security &amp; Fraud Prevention</h3>
            <FAQItem
              question="5.1 How does SpePas protect buyers and sellers?"
              answer={
                <ul className="list-disc pl-6">
                  <li>Secure payment processing to prevent fraud.</li>
                  <li>Strict seller verification to reduce counterfeit products.</li>
                  <li>24-48 hour buyer verification period to resolve disputes quickly.</li>
                </ul>
              }
            />
            <FAQItem
              question="5.2 What if I suspect fraud or a scam?"
              answer={
                <ul className="list-disc pl-6">
                  <li>Report suspicious activity immediately via the app or support email.</li>
                  <li>Do not share login details or make payments outside SpePas.</li>
                </ul>
              }
            />
            <FAQItem
              question="5.3 Does SpePas share my personal data?"
              answer={<p>No. We follow global and local privacy laws to keep your data secure. See our Privacy Policy for details.</p>}
            />

            {/* Section 6: Technical & Support */}
            <h3 className="font-medium text-[#4a36ec] text-lg xl:text-[26px] xl:leading-[34px] mb-4">6. Technical &amp; Support</h3>
            <FAQItem
              question="6.1 How do I contact SpePas support?"
              answer={
                <p>
                  📧 [Insert Email] <br /> 📞 [Insert Phone Number]
                </p>
              }
            />
            <FAQItem
              question="6.2 What if I forget my password?"
              answer={<p>Use the “Forgot Password” option to reset it via email or SMS verification.</p>}
            />
            <FAQItem
              question="6.3 Is there a SpePas mobile app?"
              answer={<p>Yes! Download our app on [Google Play Store / Apple App Store] for a seamless experience.</p>}
            />

            {/* Section 7: Policies & Terms */}
            <h3 className="font-medium text-[#4a36ec] text-lg xl:text-[26px] xl:leading-[34px] mb-4">7. Policies &amp; Terms</h3>
            <FAQItem
              question="7.1 Where can I find SpePas' full policies?"
              answer={
                <>
                  <ul className="list-disc pl-6 mb-4">
                    <li>[Return &amp; Exchange Policy]</li>
                    <li>[Terms of Use]</li>
                    <li>[Privacy Policy]</li>
                  </ul>
                  <p>By using SpePas, you agree to these policies to maintain a safe and efficient marketplace.</p>
                </>
              }
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default Faq;
