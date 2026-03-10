import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GopaProfile } from '@/features/auth';
import { ShieldCheck, Sparkles, CalendarDays, FileText, CheckCircle } from 'lucide-react';

interface GopaProfileTabProps {
  profile: GopaProfile | null;
}

const GopaProfileTab: React.FC<GopaProfileTabProps> = ({ profile }) => {
  const navigate = useNavigate();

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-gray-1 rounded-xl border border-gray-3">
        <div className="h-14 w-14 rounded-full bg-gray-2 flex items-center justify-center mb-4">
          <ShieldCheck className="h-6 w-6 text-dark-4" />
        </div>
        <p className="text-sm font-medium text-dark-2">No GOPA profile found</p>
        <p className="text-xs text-dark-4 mt-1">Register as a GOPA to see your profile here</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-dark">GOPA Profile</h3>
        <p className="text-sm text-dark-4 mt-1">Your GOPA distributor details</p>
      </div>

      <div className="bg-gray-1 rounded-xl border border-gray-3 p-5 mb-6">
        {/* Specialties */}
        <div className="flex items-start gap-3 pb-4 border-b border-gray-3">
          <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-blue-light-5 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-blue" />
          </div>
          <div>
            <p className="text-xs text-dark-4 font-medium uppercase tracking-wide">Specialties</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {profile.Specialties.map((s, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-xs font-medium bg-blue-light-5 text-blue px-2.5 py-1 rounded-full"
                >
                  <CheckCircle className="h-3 w-3" />
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-start gap-3 pt-4">
          <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-gray-2 flex items-center justify-center">
            <CalendarDays className="h-4 w-4 text-dark-4" />
          </div>
          <div>
            <p className="text-xs text-dark-4 font-medium uppercase tracking-wide">Became a GOPA</p>
            <p className="text-sm font-medium text-dark mt-0.5">
              {new Date(profile.date_added).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => navigate('/95668339501103956045/gopa-invoices/to-accept')}
          className="inline-flex items-center gap-2 bg-blue text-white font-medium text-sm py-2.5 px-5 rounded-xl hover:bg-blue-dark transition-colors duration-200"
        >
          <FileText className="h-4 w-4" />
          Pending Invoices
        </button>
        <button
          onClick={() => navigate('/95668339501103956045/gopa-invoices/accepted')}
          className="inline-flex items-center gap-2 bg-gray-1 text-dark font-medium text-sm py-2.5 px-5 rounded-xl border border-gray-3 hover:bg-gray-2 transition-colors duration-200"
        >
          <CheckCircle className="h-4 w-4" />
          Accepted Invoices
        </button>
      </div>
    </div>
  );
};

export default GopaProfileTab;
