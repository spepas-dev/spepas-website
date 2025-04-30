// src/components/marketing/MyAccount/DeliverProfileTab.tsx
import React from 'react';
import { DeliverProfile } from '@/features/auth';

const DeliverProfileTab: React.FC<{ deliver: DeliverProfile | null }> = ({ deliver }) => (
  <div>
    {deliver ? (
      <>
        <p><strong>License #:</strong> {deliver.licenseNumber}</p>
        <p><strong>Vehicles Count:</strong> {deliver.vehicles.length}</p>
      </>
    ) : (
      <p>No deliver profile found.</p>
    )}
  </div>
);

export default DeliverProfileTab;
