import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  checkoutWithExistingAddressAPI,
  checkoutWithNewAddressAPI,
} from '@/lib/orderBidsApis';
import toast from 'react-hot-toast';
import { MapPin, PlusCircle, Receipt, Truck, Percent, Package, DollarSign, AlertCircle } from 'lucide-react';

const CheckoutForm: React.FC = () => {
  const location = useLocation() as any;
  const { charges, aggeagate } = location.state || {};

  if (!charges) {
    return (
      <div className="bg-white rounded-2xl border border-gray-3 shadow-1">
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="h-14 w-14 rounded-full bg-gray-1 flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-dark-4" />
          </div>
          <p className="text-sm font-medium text-dark-2">No charge data available</p>
          <p className="text-xs text-dark-4 mt-1">Please go back to your cart and try again</p>
        </div>
      </div>
    );
  }

  const handleExisting = async () => {
    try {
      // TODO: let user pick address_id from their saved addresses
      const address_id = 'ADDRESS_ID_HERE';
      await checkoutWithExistingAddressAPI({
        address_id,
        aggeagate: Number(aggeagate),
        paymentDetails: {
          paymentMode: 'WALLET',
          walletNumber: '233554340244',
          network: 'MTN',
        },
      });
      toast.success('Checkout with existing address successful.');
    } catch {
      toast.error('Checkout failed.');
    }
  };

  const handleNew = async () => {
    try {
      // TODO: gather these from a sub-form
      const address = {
        title: 'Office address',
        addressDetails: 'S 74/8, adjacent to Palace mall',
        longitude: -73.9712,
        latitude: 40.7831,
      };
      await checkoutWithNewAddressAPI({
        address,
        aggeagate: Number(aggeagate),
        paymentDetails: {
          paymentMode: 'WALLET',
          walletNumber: '233554340244',
          network: 'MTN',
        },
      });
      toast.success('Checkout with new address successful.');
    } catch {
      toast.error('Checkout failed.');
    }
  };

  const chargeRows = [
    { icon: DollarSign, label: 'Main Amount', value: `GH\u20B5 ${charges.MAIN_AMOUNT}`, highlight: true },
    { icon: Receipt, label: 'Service Charge', value: `GH\u20B5 ${charges.SERVICE_CHARGE}` },
    { icon: Truck, label: 'Delivery Charge', value: `GH\u20B5 ${charges.DELIVERY_CHARGE}` },
    { icon: Percent, label: 'Tax', value: `${charges.TAX}%` },
    { icon: Package, label: 'Total Items', value: charges.TOTAL_ITEMS },
  ];

  return (
    <div className="space-y-6">
      {/* Charges breakdown */}
      <div className="bg-white rounded-2xl border border-gray-3 shadow-1 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-3">
          <h3 className="text-base font-semibold text-dark flex items-center gap-2">
            <Receipt className="h-4 w-4 text-dark-4" />
            Order Summary
          </h3>
        </div>

        <div className="p-5">
          <div className="space-y-0 divide-y divide-gray-3">
            {chargeRows.map(({ icon: Icon, label, value, highlight }) => (
              <div key={label} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-gray-1 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-dark-4" />
                  </div>
                  <span className="text-sm text-dark-2">{label}</span>
                </div>
                <span className={`text-sm font-semibold ${highlight ? 'text-dark text-base' : 'text-dark-2'}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Checkout actions */}
      <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-5">
        <h3 className="text-base font-semibold text-dark mb-4">Choose Delivery Address</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleExisting}
            className="flex items-center justify-center gap-2 bg-blue text-white font-medium text-sm py-3 px-5 rounded-xl hover:bg-blue-dark transition-colors duration-200"
          >
            <MapPin className="h-4 w-4" />
            Use Existing Address
          </button>
          <button
            onClick={handleNew}
            className="flex items-center justify-center gap-2 bg-gray-1 text-dark font-medium text-sm py-3 px-5 rounded-xl border border-gray-3 hover:bg-gray-2 transition-colors duration-200"
          >
            <PlusCircle className="h-4 w-4" />
            Use New Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
