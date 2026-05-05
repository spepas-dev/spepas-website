// src/pages/auth/manage-pin.tsx
//
// Settings-context entry to the unified PIN setup/reset flow. Different from
// /setup-pin which is wired into the onboarding pipeline (resolves the next
// step on success). This page redirects back to MyAccount on success so the
// user can keep navigating where they came from.

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

import PinManager from '@/components/Auth/PinManager';

const ManagePinPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <main className="overflow-hidden bg-white py-12">
      <div className="text-center mb-8">
        <Link className="inline-block" to="/">
          <img src="/images/logo/logo.png" alt="Logo" width={119} height={36} />
        </Link>
      </div>
      <PinManager
        onSuccess={() => navigate('/95668339501103956045/my-account')}
      />
    </main>
  );
};

export default ManagePinPage;
