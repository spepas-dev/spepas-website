import { Link } from 'react-router-dom';

import Breadcrumb from '../Common/Breadcrumb';

const RefundPolicy = () => {
  return (
    <>
      <Breadcrumb title={'Return Policy'} pages={['return policy']} />
      <section className="overflow-hidden py-10 bg-gray-2">
        <div className="max-w-[750px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="rounded-[10px] overflow-hidden mb-7.5">
            <img
              className="rounded-[10px]"
              src="/images/images/refund.png" // Replace with your refund image path
              alt="Refund Policies"
              width={750}
              height={477}
            />
          </div>

          <div>
            <h2 className="font-medium text-[#4a36ec] text-xl lg:text-2xl xl:text-custom-4xl mb-4">
              SpePas Auto Parts Marketplace Return Policy
            </h2>
            <p className="mb-6">
              At SpePas, we are committed to ensuring customer satisfaction with every purchase. If you are not completely satisfied with
              your order, you may request an exchange in accordance with our return policy.
            </p>

            <h3 className="font-medium text-[#4a36ec] text-lg xl:text-[26px] xl:leading-[34px] mb-6">
              Eligibility for Returns & Exchanges
            </h3>
            <ol className="list-decimal pl-6 mb-6">
              <li>
                <strong>Timeframe:</strong> Returns must be initiated within 24-48 hours of delivery. Customers are required to verify their
                items immediately upon receipt.
              </li>
              <li>
                <strong>Condition:</strong> Items must be unused, in their original packaging, and in a resalable condition.
              </li>
              <li>
                <strong>Exceptions:</strong> Electrical parts, custom orders, and special imports are not eligible for returns unless
                defective.
              </li>
              <li>
                <strong>Proof of Purchase:</strong> A valid receipt or order confirmation is required.
              </li>
            </ol>

            <h3 className="font-medium text-[#4a36ec] text-lg xl:text-[26px] xl:leading-[34px] mb-6">Return & Exchange Process</h3>
            <div className="mb-6">
              <p className="font-medium mb-2">Initiating a Return:</p>
              <ul className="list-disc pl-8 mb-4">
                <li>Customers must request a return through the SpePas app or website within 24-48 hours of delivery.</li>
                <li>Provide a reason for return along with supporting evidence (e.g., photos of defects or incorrect items).</li>
              </ul>

              <p className="font-medium mb-2">Inspection & Approval:</p>
              <ul className="list-disc pl-8">
                <li>Items will be inspected upon return.</li>
                <li>If approved, customers will receive an exchange for the same or similar item.</li>
                <li>Exchanges are prioritized, and only in rare cases where an exchange is not possible will a refund be considered.</li>
              </ul>
            </div>

            <h3 className="font-medium text-[#4a36ec] text-lg xl:text-[26px] xl:leading-[34px] mb-6">Exchange & Refund Policy</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>
                <strong>Exchanges Preferred:</strong> Customers will receive a replacement or an equivalent item whenever possible.
              </li>
              <li>
                <strong>Refunds Only in Rare Cases:</strong> Refunds are only issued when the seller is clearly at fault with undeniable
                evidence (e.g., defective or incorrect item due to seller error).
              </li>
              <li>
                <strong>Shipping Costs:</strong> Customers are responsible for return shipping fees unless the error was from the seller.
              </li>
            </ul>

            <h3 className="font-medium text-[#4a36ec] text-lg xl:text-[26px] xl:leading-[34px] mb-6">
              Customer History & Priority Handling
            </h3>
            <p className="mb-6">SpePas values loyal customers and provides flexible return options based on purchase history:</p>
            <ul className="list-disc pl-6 mb-6">
              <li>
                <strong>Frequent & Long-Term Customers (Regular purchases over 6+ months):</strong>
                <ul className="list-disc pl-6 mt-2">
                  <li>Faster resolution and priority handling of exchanges.</li>
                </ul>
              </li>
              <li>
                <strong>New or One-Time Customers:</strong>
                <ul className="list-disc pl-6 mt-2">
                  <li>
                    Returns subject to additional verification, including a police report or investigative evidence for high-value items.
                  </li>
                </ul>
              </li>
            </ul>

            <h3 className="font-medium text-[#4a36ec] text-lg xl:text-[26px] xl:leading-[34px] mb-6">Dispute Resolution</h3>
            <ul className="list-disc pl-6 mb-6">
              <li>Disputes will be reviewed on a case-by-case basis by SpePas Admins.</li>
              <li>If fraud is suspected, SpePas reserves the right to deny the return request.</li>
            </ul>

            <p className="mb-6">
              For assistance, contact our support team via the SpePas app or email us at{' '}
              <a href="mailto:support@spepas.com" className="text-blue hover:underline">
                support@spepas.com
              </a>
              .
            </p>

            <p className="mt-6 italic">SpePas reserves the right to modify this policy at any time without prior notice.</p>

            <Link to="/contact">
              <a className="inline-flex items-center mt-8 hover:text-white border border-gray-3 bg-white py-2 px-4 rounded-md ease-out duration-200 hover:bg-blue hover:border-blue">
                Contact Support
              </a>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default RefundPolicy;
