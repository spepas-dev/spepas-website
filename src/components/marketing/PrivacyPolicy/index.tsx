import Breadcrumb from '../Common/Breadcrumb';

const PrivacyPolicy = () => {
  return (
    <>
      <Breadcrumb title={'Privacy Policy'} pages={['Privacy Policy']} />
      <section className="overflow-hidden py-10 bg-gray-2">
        <div className="max-w-[750px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {/* Optional header image - update the image path as needed */}

          <div>
            <h2 className="font-medium text-[#4a36ec] text-xl lg:text-2xl xl:text-custom-4xl mb-4">SpePas Privacy Policy</h2>
            <p className="mb-6">
              <strong>Effective Date:</strong> [18/03/2025]
            </p>
            <p className="mb-6">
              SpePas is committed to protecting your privacy and ensuring a safe and secure marketplace for all users. This Privacy Policy
              explains how we collect, use, and safeguard your information when you use our platform. By using SpePas, you agree to the
              terms outlined below.
            </p>

            <hr className="my-4" />

            <h3 className="font-medium text-[#4a36ec] text-lg xl:text-[26px] xl:leading-[34px] mb-4">1. Information We Collect</h3>
            <p className="mb-4">We collect the following types of information to improve user experience and maintain security:</p>
            <h4 className="font-medium text-[#4a36ec] mb-2">1.1 Personal Information</h4>
            <ul className="list-disc pl-6 mb-4">
              <li>Name, phone number, email address, and location (provided during account registration).</li>
              <li>Payment details (Mobile Money, bank account info) for transactions.</li>
            </ul>
            <h4 className="font-medium text-[#4a36ec] mb-2">1.2 Transaction &amp; Activity Data</h4>
            <ul className="list-disc pl-6 mb-4">
              <li>Order history, payment records, and communication between buyers and sellers.</li>
              <li>Device and browser information for security monitoring.</li>
            </ul>
            <h4 className="font-medium text-[#4a36ec] mb-2">1.3 Fraud Prevention &amp; Security Data</h4>
            <ul className="list-disc pl-6 mb-4">
              <li>Verification details to prevent fraud and scams (e.g., ID verification in suspicious cases).</li>
              <li>Reports of fraudulent activity, disputes, or rule violations.</li>
            </ul>

            <hr className="my-4" />

            <h3 className="font-medium text-[#4a36ec] text-lg xl:text-[26px] xl:leading-[34px] mb-4">2. How We Use Your Information</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Process transactions (buying, selling, payments).</li>
              <li>Enhance security by detecting fraud, suspicious activity, and policy violations.</li>
              <li>Communicate with you regarding orders, disputes, or platform updates.</li>
              <li>Improve the marketplace by analyzing user behavior and feedback.</li>
            </ul>
            <p className="mb-6">We do not sell or share your personal information with third parties for marketing purposes.</p>

            <hr className="my-4" />

            <h3 className="font-medium text-[#4a36ec] text-lg xl:text-[26px] xl:leading-[34px] mb-4">3. Data Security &amp; Protection</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>
                <strong>Encrypted Transactions:</strong> All payment and personal data is encrypted to prevent unauthorized access.
              </li>
              <li>
                <strong>Fraud Monitoring:</strong> We actively monitor and investigate fraudulent activities, scams, and cyber threats.
              </li>
              <li>
                <strong>Access Control:</strong> Only authorized personnel have access to sensitive user data.
              </li>
            </ul>
            <p className="mb-6">
              Users are encouraged to:
              <br />
              ✅ Use strong passwords and enable security features.
              <br />
              ✅ Report suspicious activity to SpePas support.
              <br />❌ Never share login credentials or payment details with third parties.
            </p>

            <hr className="my-4" />

            <h3 className="font-medium text-[#4a36ec] text-lg xl:text-[26px] xl:leading-[34px] mb-4">
              4. Fraud Prevention &amp; Legal Compliance
            </h3>
            <ul className="list-disc pl-6 mb-4">
              <li>SpePas follows local and international laws against fraud, scams, and cybercrime, including:</li>
              <li>West African Financial Regulations on secure payments and anti-money laundering.</li>
              <li>Global Data Protection Standards (e.g., GDPR for international compliance).</li>
              <li>
                Law Enforcement Cooperation: In cases of fraud or illegal activity, we may share necessary information with authorities.
              </li>
            </ul>

            <hr className="my-4" />

            <h3 className="font-medium text-[#4a36ec] text-lg xl:text-[26px] xl:leading-[34px] mb-4">5. User Rights &amp; Data Control</h3>
            <ul className="list-disc pl-6 mb-4">
              <li>Access &amp; Updates: Users can update or request access to their personal data.</li>
              <li>
                Account Deletion: You can request account deletion, but transaction records may be kept for legal and security reasons.
              </li>
              <li>Opt-Out Options: Users can opt out of non-essential notifications.</li>
            </ul>

            <hr className="my-4" />

            <h3 className="font-medium text-[#4a36ec] text-lg xl:text-[26px] xl:leading-[34px] mb-4">
              6. Third-Party Services &amp; Links
            </h3>
            <p className="mb-6">
              SpePas may contain links to third-party payment providers and logistics services. We are not responsible for their data
              policies, so users should review their privacy terms separately.
            </p>

            <hr className="my-4" />

            <h3 className="font-medium text-[#4a36ec] text-lg xl:text-[26px] xl:leading-[34px] mb-4">7. Changes to This Policy</h3>
            <p className="mb-6">We may update this Privacy Policy as needed. Continued use of SpePas means you accept any updates.</p>

            <hr className="my-4" />

            <h3 className="font-medium text-[#4a36ec] text-lg xl:text-[26px] xl:leading-[34px] mb-4">8. Contact Us</h3>
            <p className="mb-6">
              For privacy concerns or security issues, contact us:
              <br />
              📧 [Insert Email]
              <br />
              📞 [Insert Phone Number]
            </p>
            <p className="mb-6">
              SpePas is dedicated to maintaining a secure, fraud-free marketplace while protecting user privacy. Thank you for trusting us!
              🚀
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default PrivacyPolicy;
