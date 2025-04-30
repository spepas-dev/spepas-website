// src/components/marketing/MyAccount/GopaProfileTab.tsx
import React from 'react';
import { GopaProfile } from '@/features/auth';

const GopaProfileTab: React.FC<{ profile: GopaProfile | null }> = ({ profile }) => (
  <div>
    {profile ? (
      <>
        <p><strong>GOPA ID:</strong> {profile.Gopa_ID}</p>
        <p><strong>Specialties:</strong> {profile.Specialties.join(', ')}</p>
        <p><strong>Added:</strong> {new Date(profile.date_added).toLocaleDateString()}</p>
      </>
    ) : (
      <p>No GOPA profile found.</p>
    )}
  </div>
);

export default GopaProfileTab;
