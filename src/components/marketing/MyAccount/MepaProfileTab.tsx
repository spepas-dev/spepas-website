import React from 'react';
import { MepaProfile } from '@/features/auth';
import { Store, Hash, MapPin, Building2 } from 'lucide-react';

const MepaProfileTab: React.FC<{ profile: MepaProfile | null }> = ({ profile }) => {
  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-gray-1 rounded-xl border border-gray-3">
        <div className="h-14 w-14 rounded-full bg-gray-2 flex items-center justify-center mb-4">
          <Store className="h-6 w-6 text-dark-4" />
        </div>
        <p className="text-sm font-medium text-dark-2">No MEPA profile found</p>
        <p className="text-xs text-dark-4 mt-1">Register as a MEPA to see your profile here</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-dark">MEPA Profile</h3>
        <p className="text-sm text-dark-4 mt-1">Your Mechanical Parts Agent details</p>
      </div>

      <div className="bg-gray-1 rounded-xl border border-gray-3 p-5">
        <div className="space-y-0 divide-y divide-gray-3">
          <div className="flex items-start gap-3 py-3.5 first:pt-0">
            <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-blue-light-5 flex items-center justify-center">
              <Hash className="h-4 w-4 text-blue" />
            </div>
            <div>
              <p className="text-xs text-dark-4 font-medium uppercase tracking-wide">MEPA ID</p>
              <p className="text-sm font-medium text-dark mt-0.5 font-mono">{profile.Mepa_ID}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 py-3.5">
            <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-gray-2 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-dark-4" />
            </div>
            <div>
              <p className="text-xs text-dark-4 font-medium uppercase tracking-wide">Shop Name</p>
              <p className="text-sm font-medium text-dark mt-0.5">{profile.shop_name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 py-3.5 last:pb-0">
            <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-gray-2 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-dark-4" />
            </div>
            <div>
              <p className="text-xs text-dark-4 font-medium uppercase tracking-wide">Address</p>
              <p className="text-sm font-medium text-dark mt-0.5">{profile.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MepaProfileTab;
