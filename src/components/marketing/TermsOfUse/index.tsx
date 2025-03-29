import Breadcrumb from '../Common/Breadcrumb';

const TermsOfUse = () => {
  return (
    <>
      <Breadcrumb title={'Terms of Use'} pages={['Terms of Use']} />
      <section className="overflow-hidden py-10 bg-gray-2">
        <div className="max-w-[750px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          {/* Optional header image - update the image path as needed */}

          <div>
            <h2 className="font-medium text-dark text-xl lg:text-2xl xl:text-custom-4xl mb-4">SpePas Terms of Use</h2>
            <p className="mb-6">
              <strong>Effective Date:</strong> [Insert Date]
            </p>
            <p className="mb-6">
              Welcome to SpePas, an auto parts marketplace connecting buyers and sellers across West Africa. By accessing or using our
              platform, you agree to these Terms of Use. If you do not agree, please refrain from using SpePas.
            </p>
            <hr className="my-4" />

            <h3 className="font-medium text-dark text-lg xl:text-[26px] xl:leading-[34px] mb-4">1. General Overview</h3>
            <p className="mb-6">
              SpePas provides an online marketplace where independent sellers list auto parts for buyers to purchase. SpePas does not
              manufacture, own, or inspect any of the products listed. Transactions occur between buyers and sellers, with SpePas acting as
              a facilitator.
            </p>
            <hr className="my-4" />

            <h3 className="font-medium text-dark text-lg xl:text-[26px] xl:leading-[34px] mb-4">2. User Accounts &amp; Responsibilities</h3>
            <h4 className="font-medium text-dark mb-2">2.1 Account Creation</h4>
            <ul className="list-disc pl-6 mb-4">
              <li>To buy or sell on SpePas, you must create an account with accurate and up-to-date information.</li>
              <li>Users must be at least 18 years old or have parental consent to use the platform.</li>
            </ul>
            <h4 className="font-medium text-dark mb-2">2.2 Account Security</h4>
            <ul className="list-disc pl-6 mb-6">
              <li>Users are responsible for maintaining confidentiality of their login credentials.</li>
              <li>Any unauthorized access must be reported to SpePas immediately.</li>
            </ul>
            <hr className="my-4" />

            <h3 className="font-medium text-dark text-lg xl:text-[26px] xl:leading-[34px] mb-4">3. Buying on SpePas</h3>
            <h4 className="font-medium text-dark mb-2">3.1 Order Process</h4>
            <ul className="list-disc pl-6 mb-4">
              <li>When you place an order, you enter into a binding agreement to purchase the item.</li>
              <li>Buyers should verify product details (compatibility, specifications, etc.) before completing a purchase.</li>
            </ul>
            <h4 className="font-medium text-dark mb-2">3.2 Payments &amp; Fees</h4>
            <ul className="list-disc pl-6 mb-4">
              <li>Payments are processed through Mobile Money, bank transfers, or other secure methods.</li>
              <li>Buyers may be subject to transaction fees depending on their payment method.</li>
            </ul>
            <h4 className="font-medium text-dark mb-2">3.3 Delivery &amp; Inspection</h4>
            <ul className="list-disc pl-6 mb-4">
              <li>Buyers must inspect items immediately upon delivery and report any issues within 24-48 hours.</li>
              <li>
                Failure to report an issue within this timeframe means the item is considered accepted, and no return requests will be
                entertained.
              </li>
            </ul>
            <h4 className="font-medium text-dark mb-2">3.4 Returns &amp; Exchanges</h4>
            <ul className="list-disc pl-6 mb-6">
              <li>Returns are exchange-based, with refunds only granted in rare cases where the seller is clearly at fault.</li>
              <li>Buyers with a strong purchase history may receive faster return processing.</li>
              <li>First-time buyers may be required to provide additional verification before returns are approved.</li>
            </ul>
            <hr className="my-4" />

            <h3 className="font-medium text-dark text-lg xl:text-[26px] xl:leading-[34px] mb-4">4. Selling on SpePas</h3>
            <h4 className="font-medium text-dark mb-2">4.1 Seller Responsibilities</h4>
            <ul className="list-disc pl-6 mb-4">
              <li>Sellers must provide accurate product descriptions, clear images, and correct pricing.</li>
              <li>Listings should not include counterfeit, stolen, or illegal auto parts.</li>
              <li>Sellers must respond to orders and inquiries promptly.</li>
            </ul>
            <h4 className="font-medium text-dark mb-2">4.2 Order Fulfillment &amp; Shipping</h4>
            <ul className="list-disc pl-6 mb-4">
              <li>Sellers are responsible for timely delivery of sold items.</li>
              <li>If a seller cannot fulfill an order, they must inform the buyer and SpePas immediately.</li>
            </ul>
            <h4 className="font-medium text-dark mb-2">4.3 Disputes &amp; Returns</h4>
            <ul className="list-disc pl-6 mb-6">
              <li>If a buyer requests a return, sellers must comply with SpePas’ Return Policy.</li>
              <li>Sellers may be held accountable for refunds if found negligent or dishonest.</li>
            </ul>
            <hr className="my-4" />

            <h3 className="font-medium text-dark text-lg xl:text-[26px] xl:leading-[34px] mb-4">5. Prohibited Activities</h3>
            <p className="mb-6">To maintain a trusted marketplace, users must not:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>List or sell counterfeit, stolen, hazardous, or banned items.</li>
              <li>Use fraudulent payment methods or engage in scams.</li>
              <li>Manipulate pricing, reviews, or buyer feedback.</li>
              <li>Harass, threaten, or mislead other users.</li>
            </ul>
            <hr className="my-4" />

            <h3 className="font-medium text-dark text-lg xl:text-[26px] xl:leading-[34px] mb-4">6. Dispute Resolution</h3>
            <p className="mb-6">
              SpePas encourages users to resolve disputes amicably through our Customer Support team. If a resolution cannot be reached,
              SpePas reserves the right to make a final decision based on available evidence.
            </p>
            <hr className="my-4" />

            <h3 className="font-medium text-dark text-lg xl:text-[26px] xl:leading-[34px] mb-4">7. Limitation of Liability</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>SpePas is not liable for losses, damages, or disputes arising from transactions between buyers and sellers.</li>
              <li>SpePas does not guarantee the quality, safety, or legality of products sold by third-party sellers.</li>
            </ul>
            <hr className="my-4" />

            <h3 className="font-medium text-dark text-lg xl:text-[26px] xl:leading-[34px] mb-4">8. Changes to Terms</h3>
            <p className="mb-6">
              SpePas may update these Terms of Use periodically. Continued use of the platform after updates signifies acceptance of the new
              terms.
            </p>
            <hr className="my-4" />

            <h3 className="font-medium text-dark text-lg xl:text-[26px] xl:leading-[34px] mb-4">9. Contact Information</h3>
            <p className="mb-6">
              For questions or support, contact SpePas at:
              <br />
              📧 [Insert Email]
              <br />
              📞 [Insert Phone Number]
            </p>
            <p className="mb-6">
              By using SpePas, you agree to abide by these terms and help us build a trusted auto parts marketplace in West Africa. 🚀
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default TermsOfUse;
