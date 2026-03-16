/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import { DeliverProfile } from '@/features/auth';

const DeliverProfileTab: React.FC<{ deliver: DeliverProfile | null }> = ({ deliver }) => {
  if (!deliver) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-sm">No delivery profile found.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Delivery Profile</h2>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">License Number</span>
          <p className="text-sm font-semibold text-gray-800 mt-1 font-mono">{deliver.licenseNumber || '—'}</p>
        </div>
        <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Vehicles</span>
          <p className="text-sm font-semibold text-gray-800 mt-1">{deliver.vehicles.length} registered</p>
        </div>
        <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Status</span>
          <p className="mt-1">
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-semibold ${deliver.status === 1 ? 'text-green-600' : 'text-amber-600'}`}
            >
              <span className={`w-2 h-2 rounded-full ${deliver.status === 1 ? 'bg-green-500' : 'bg-amber-500'}`} />
              {deliver.status === 1 ? 'Active' : 'Pending'}
            </span>
          </p>
        </div>
      </div>

      {/* Vehicle list */}
      {deliver.vehicles.length > 0 && (
        <>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Registered Vehicles</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {deliver.vehicles.map((v: any) => (
              <div key={v.Vehicle_ID} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue/10 flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                      />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-800">{v.model}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{v.registrationNumber}</p>
                    {v.color && <p className="text-xs text-gray-400 mt-0.5">{v.color}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DeliverProfileTab;
