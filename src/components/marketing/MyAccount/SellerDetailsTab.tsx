import React from 'react';
import { SellerDetails } from '@/features/auth';
import { Store, ShoppingBag, FileText } from 'lucide-react';

const SellerDetailsTab: React.FC<{ details: SellerDetails | null }> = ({ details }) => {
  if (!details) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-gray-1 rounded-xl border border-gray-3">
        <div className="h-14 w-14 rounded-full bg-gray-2 flex items-center justify-center mb-4">
          <Store className="h-6 w-6 text-dark-4" />
        </div>
        <p className="text-sm font-medium text-dark-2">No seller profile found</p>
        <p className="text-xs text-dark-4 mt-1">Register as a seller to see your details here</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-dark">Seller Profile</h3>
        <p className="text-sm text-dark-4 mt-1">Your store and business information</p>
      </div>

      <div className="bg-gray-1 rounded-xl border border-gray-3 p-5">
        <div className="space-y-0 divide-y divide-gray-3">
          <div className="flex items-start gap-3 py-3.5 first:pt-0">
            <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-blue-light-5 flex items-center justify-center">
              <ShoppingBag className="h-4 w-4 text-blue" />
            </div>
            <div>
              <p className="text-xs text-dark-4 font-medium uppercase tracking-wide">Store Name</p>
              <p className="text-sm font-medium text-dark mt-0.5">{details.storeName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 py-3.5 last:pb-0">
            <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-gray-2 flex items-center justify-center">
              <FileText className="h-4 w-4 text-dark-4" />
            </div>
            <div>
              <p className="text-xs text-dark-4 font-medium uppercase tracking-wide">Business Registration</p>
              {details.business_reg_url ? (
                <a
                  href={details.business_reg_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium text-blue hover:text-blue-dark mt-0.5 inline-block transition-colors"
                >
                  View Document
                </a>
              ) : (
                <p className="text-sm text-dark-4 mt-0.5">Not uploaded</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDetailsTab;
