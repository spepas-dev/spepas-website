// src/components/marketing/MyAccount/GeneralDetails.tsx
import React from 'react';
import { UserType } from '@/features/auth';

const GeneralDetails: React.FC<{ user: UserType }> = ({ user }) => (
  <div className="space-y-2">
    <p><strong>Name:</strong> {user.name}</p>
    <p><strong>Email:</strong> {user.email}</p>
    <p><strong>Phone:</strong> {user.phoneNumber}</p>
    <p><strong>Role:</strong> {user.role}</p>
    <p><strong>Member since:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
  </div>
);

export default GeneralDetails;
