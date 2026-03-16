import React from 'react';
import { useNavigate } from 'react-router-dom';

import { GopaProfile } from '@/features/auth';

const GopaProfileTab: React.FC<{ profile: GopaProfile | null }> = ({ profile }) => {
  const navigate = useNavigate();

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-sm">No GOPA profile found.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">GOPA Profile</h2>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Specialties</span>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {profile.Specialties.length > 0 ? (
              profile.Specialties.map((s, i) => (
                <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-full bg-blue/10 text-blue text-xs font-medium">
                  {s}
                </span>
              ))
            ) : (
              <span className="text-sm text-gray-500">None specified</span>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Became GOPA</span>
          <p className="text-sm font-semibold text-gray-800 mt-1">
            {new Date(profile.date_added).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
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
      </div>

      {/* Quick actions */}
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quick Actions</h3>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate('/gopa-invoices/to-accept')}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium py-2.5 px-5 rounded-xl shadow-sm hover:opacity-90 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Pending Invoices
        </button>
        <button
          onClick={() => navigate('/gopa-invoices/accepted')}
          className="inline-flex items-center gap-2 bg-white border border-blue text-blue text-sm font-medium py-2.5 px-5 rounded-xl hover:bg-blue/5 transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Accepted Invoices
        </button>
      </div>
    </div>
  );
};

export default GopaProfileTab;
