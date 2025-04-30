// src/components/marketing/MyAccount/MepaProfileTab.tsx
import React from 'react';
import { MepaProfile } from '@/features/auth';

const MepaProfileTab: React.FC<{ profile: MepaProfile | null }> = ({ profile }) => (
  <div>
    {profile ? (
      <>
        <p><strong>MEPA ID:</strong> {profile.Mepa_ID}</p>
        <p><strong>Shop Name:</strong> {profile.shop_name}</p>
        <p><strong>Address:</strong> {profile.address}</p>
      </>
    ) : (
      <p>No MEPA profile found.</p>
    )}
  </div>
);

export default MepaProfileTab;
