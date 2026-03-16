import React from 'react';
import { UserType } from '@/features/auth';

const Field: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="flex flex-col gap-1 bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-100">
    <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">{label}</span>
    <span className="text-sm font-semibold text-gray-800">{value || '—'}</span>
  </div>
);

const GeneralDetails: React.FC<{ user: UserType }> = ({ user }) => (
  <div>
    <h2 className="text-xl font-bold text-gray-800 mb-6">General Profile</h2>
    <div className="grid sm:grid-cols-2 gap-4">
      <Field label="Full Name" value={user.name} />
      <Field label="Email Address" value={user.email} />
      <Field label="Phone Number" value={user.phoneNumber} />
      <Field label="Role" value={user.role} />
      <Field label="Member Since" value={new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
      <Field label="Status" value={
        <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${user.status === 1 ? 'text-green-600' : 'text-amber-600'}`}>
          <span className={`w-2 h-2 rounded-full ${user.status === 1 ? 'bg-green-500' : 'bg-amber-500'}`} />
          {user.status === 1 ? 'Active' : 'Inactive'}
        </span>
      } />
    </div>
  </div>
);

export default GeneralDetails;
