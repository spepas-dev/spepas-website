import React from 'react';
import { UserType } from '@/features/auth';
import { User, Mail, Phone, Shield, CalendarDays } from 'lucide-react';

interface InfoRowProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3.5">
    <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-gray-1 flex items-center justify-center">
      <Icon className="h-4 w-4 text-dark-4" />
    </div>
    <div className="min-w-0">
      <p className="text-xs text-dark-4 font-medium uppercase tracking-wide">{label}</p>
      <p className="text-sm text-dark font-medium mt-0.5 truncate">{value}</p>
    </div>
  </div>
);

const GeneralDetails: React.FC<{ user: UserType }> = ({ user }) => (
  <div>
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-dark">General Profile</h3>
      <p className="text-sm text-dark-4 mt-1">Your basic account information</p>
    </div>

    <div className="bg-gray-1 rounded-xl border border-gray-3 p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 divide-y sm:divide-y-0 divide-gray-3">
        <div className="space-y-0 divide-y divide-gray-3">
          <InfoRow icon={User} label="Full Name" value={user.name} />
          <InfoRow icon={Mail} label="Email Address" value={user.email} />
          <InfoRow icon={Phone} label="Phone Number" value={user.phoneNumber} />
        </div>
        <div className="space-y-0 divide-y divide-gray-3">
          <InfoRow icon={Shield} label="Account Role" value={user.role} />
          <InfoRow
            icon={CalendarDays}
            label="Member Since"
            value={new Date(user.createdAt).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          />
        </div>
      </div>
    </div>
  </div>
);

export default GeneralDetails;
