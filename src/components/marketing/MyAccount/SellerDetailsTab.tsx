// src/components/marketing/MyAccount/SellerDetailsTab.tsx
import React from 'react';

import { SellerDetails } from '@/features/auth';

const SellerDetailsTab: React.FC<{ details: SellerDetails | null }> = ({ details }) => (
  <div>
    {details ? (
      <>
        <p>
          <strong>Store Name:</strong> {details.storeName}
        </p>
        <p>
          <strong>Business Reg URL:</strong> {details.business_reg_url || 'N/A'}
        </p>
      </>
    ) : (
      <p>No seller details found.</p>
    )}
  </div>
);

export default SellerDetailsTab;
