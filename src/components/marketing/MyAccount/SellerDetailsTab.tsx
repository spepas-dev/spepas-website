import React from 'react';

import { SellerDetails } from '@/features/auth';

const SellerDetailsTab: React.FC<{ details: SellerDetails | null }> = ({ details }) => {
  if (!details) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-sm">No seller profile found.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Seller Profile</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Store Name</span>
          <p className="text-sm font-semibold text-gray-800 mt-1">{details.storeName || '—'}</p>
        </div>
        <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Status</span>
          <p className="mt-1">
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-semibold ${details.status === 1 ? 'text-green-600' : 'text-amber-600'}`}
            >
              <span className={`w-2 h-2 rounded-full ${details.status === 1 ? 'bg-green-500' : 'bg-amber-500'}`} />
              {details.status === 1 ? 'Active' : 'Pending'}
            </span>
          </p>
        </div>
        <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100 sm:col-span-2">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Business Registration</span>
          {details.business_reg_url ? (
            <a
              href={details.business_reg_url}
              target="_blank"
              rel="noreferrer"
              className="block text-sm font-medium text-blue hover:underline mt-1 truncate"
            >
              View Document
            </a>
          ) : (
            <p className="text-sm text-gray-500 mt-1">Not uploaded</p>
          )}
        </div>
        <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Joined</span>
          <p className="text-sm font-semibold text-gray-800 mt-1">
            {new Date(details.date_added).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerDetailsTab;
