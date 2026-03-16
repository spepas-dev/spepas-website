import React from 'react';

import { MepaProfile } from '@/features/auth';

const MepaProfileTab: React.FC<{ profile: MepaProfile | null }> = ({ profile }) => {
  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-sm">No MEPA profile found.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">MEPA Profile</h2>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">MEPA ID</span>
          <p className="text-sm font-semibold text-gray-800 mt-1 font-mono">{profile.Mepa_ID}</p>
        </div>
        <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Shop Name</span>
          <p className="text-sm font-semibold text-gray-800 mt-1">{profile.shop_name || '—'}</p>
        </div>
        <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100 sm:col-span-2">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Address</span>
          <p className="text-sm font-semibold text-gray-800 mt-1">{profile.address || '—'}</p>
        </div>
        <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Status</span>
          <p className="mt-1">
            <span
              className={`inline-flex items-center gap-1.5 text-sm font-semibold ${profile.status === 1 ? 'text-green-600' : 'text-amber-600'}`}
            >
              <span className={`w-2 h-2 rounded-full ${profile.status === 1 ? 'bg-green-500' : 'bg-amber-500'}`} />
              {profile.status === 1 ? 'Active' : 'Pending'}
            </span>
          </p>
        </div>
        <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Joined</span>
          <p className="text-sm font-semibold text-gray-800 mt-1">
            {new Date(profile.date_added).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MepaProfileTab;
