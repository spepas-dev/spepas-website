// src/components/marketing/MyAccount/GopaProfileTab.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GopaProfile } from '@/features/auth';

interface GopaProfileTabProps {
  profile: GopaProfile | null;
}

const GopaProfileTab: React.FC<GopaProfileTabProps> = ({ profile }) => {
  const navigate = useNavigate();

  if (!profile) {
    return <p>No GOPA profile found.</p>;
  }

  return (
    <div>
      <p>
        <strong>Specialties:</strong> {profile.Specialties.join(', ')}
      </p>
      <p>
        <strong>Became a GOPA on:</strong>{' '}
        {new Date(profile.date_added).toLocaleDateString()}
      </p>

      <div className="mt-6 flex gap-4">
        <button
          onClick={() => navigate('/gopa-invoices/to-accept')}
          className="bg-gradient-to-r from-blue to-blue-500 text-white py-2 px-4 rounded-lg shadow hover:opacity-90 transition"
        >
          Pending Invoices
        </button>
        <button
          onClick={() => navigate('/gopa-invoices/accepted')}
          className="bg-gradient-to-r from-blue-500 to-blue text-white py-2 px-4 rounded-lg shadow hover:opacity-90 transition"
        >
          Accepted Invoices
        </button>
      </div>
    </div>
  );
};

export default GopaProfileTab;
