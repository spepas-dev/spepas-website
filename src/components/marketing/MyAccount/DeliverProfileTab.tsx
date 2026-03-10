import React from 'react';
import { DeliverProfile } from '@/features/auth';
import { Truck, CreditCard, Car } from 'lucide-react';

const DeliverProfileTab: React.FC<{ deliver: DeliverProfile | null }> = ({ deliver }) => {
  if (!deliver) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-gray-1 rounded-xl border border-gray-3">
        <div className="h-14 w-14 rounded-full bg-gray-2 flex items-center justify-center mb-4">
          <Truck className="h-6 w-6 text-dark-4" />
        </div>
        <p className="text-sm font-medium text-dark-2">No delivery profile found</p>
        <p className="text-xs text-dark-4 mt-1">Register as a rider to see your profile here</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-dark">Delivery Profile</h3>
        <p className="text-sm text-dark-4 mt-1">Your rider and vehicle information</p>
      </div>

      <div className="bg-gray-1 rounded-xl border border-gray-3 p-5">
        <div className="space-y-0 divide-y divide-gray-3">
          <div className="flex items-start gap-3 py-3.5 first:pt-0">
            <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-blue-light-5 flex items-center justify-center">
              <CreditCard className="h-4 w-4 text-blue" />
            </div>
            <div>
              <p className="text-xs text-dark-4 font-medium uppercase tracking-wide">License Number</p>
              <p className="text-sm font-medium text-dark mt-0.5 font-mono">{deliver.licenseNumber}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 py-3.5 last:pb-0">
            <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-gray-2 flex items-center justify-center">
              <Car className="h-4 w-4 text-dark-4" />
            </div>
            <div>
              <p className="text-xs text-dark-4 font-medium uppercase tracking-wide">Registered Vehicles</p>
              <p className="text-sm font-medium text-dark mt-0.5">
                {deliver.vehicles.length} vehicle{deliver.vehicles.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliverProfileTab;
