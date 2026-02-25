import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Store, MapPin, CalendarDays, MessageSquare } from 'lucide-react';

const IMAGES: string[] = [
  'https://www.serac-group.com/wp-content/uploads/2019/09/Parts.jpg',
  'https://thumbs.dreamstime.com/b/set-grey-metal-car-brake-discs-black-pads-photographed-clean-white-background-essential-auto-spare-parts-effective-398612931.jpg',
  'https://blogs.gomechanic.com/wp-content/uploads/2020/07/How-to-spot-Counterfiet-fake-spare-parts-01.jpg',
];

const OfferBidDetail: React.FC = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  return (
    <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center">
            <Eye className="h-5 w-5 text-blue" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-dark">Offer Details</h1>
            <p className="text-sm text-dark-4">Review this seller's bid</p>
          </div>
        </div>
        <span className="text-[10px] px-2.5 py-1 rounded-full font-medium bg-yellow-50 text-yellow-600">
          Pending
        </span>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* Images */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-4">
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-1">
              <img
                src={IMAGES[active]}
                alt={`Offer image ${active + 1}`}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-3 grid grid-cols-5 sm:grid-cols-6 gap-2">
              {IMAGES.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                    active === i ? 'border-blue ring-1 ring-blue/20' : 'border-gray-3 hover:border-dark-5'
                  }`}
                >
                  <img src={src} className="h-16 w-full object-cover" alt="" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-5 space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-dark">Radiator</h2>
              <p className="text-sm text-dark-4 mt-0.5">Toyota - Camry - 2018</p>
            </div>

            <p className="text-sm text-dark-3 leading-relaxed">
              Brand new radiator with 12-month warranty. OEM grade fit and finish.
              Ready for immediate pickup or delivery.
            </p>

            <div className="bg-gray-1 rounded-xl border border-gray-3 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-dark-4 font-medium uppercase tracking-wide">Total Price</p>
                  <p className="text-base font-bold text-dark mt-0.5">GH&#x20B5; 2,500</p>
                </div>
                <div>
                  <p className="text-xs text-dark-4 font-medium uppercase tracking-wide">Unit Price</p>
                  <p className="text-base font-bold text-dark mt-0.5">GH&#x20B5; 500</p>
                </div>
                <div>
                  <p className="text-xs text-dark-4 font-medium uppercase tracking-wide">Quantity</p>
                  <p className="text-sm font-medium text-dark mt-0.5">5</p>
                </div>
                <div>
                  <p className="text-xs text-dark-4 font-medium uppercase tracking-wide">Date</p>
                  <p className="text-sm font-medium text-dark mt-0.5">01 Oct 2025</p>
                </div>
              </div>
            </div>

            {/* Seller */}
            <div className="border-t border-gray-3 pt-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-lg bg-blue-light-5 flex items-center justify-center">
                  <Store className="h-4 w-4 text-blue" />
                </div>
                <div>
                  <p className="text-xs text-dark-4">Seller</p>
                  <p className="text-sm font-semibold text-dark">A and A Ventures</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-dark-5 mb-3">
                <MapPin className="h-3 w-3" />
                40.7831, -73.9712
              </div>
              <div className="flex gap-2">
                <button className="flex-1 inline-flex items-center justify-center gap-2 bg-gray-1 text-dark font-medium text-sm py-2.5 rounded-xl border border-gray-3 hover:bg-gray-2 transition-colors duration-200">
                  <Store className="h-4 w-4" />
                  View Store
                </button>
                <a
                  href="/95668339501103956045/chat/c1"
                  className="flex-1 inline-flex items-center justify-center gap-2 bg-blue text-white font-medium text-sm py-2.5 rounded-xl hover:bg-blue-dark transition-colors duration-200"
                >
                  <MessageSquare className="h-4 w-4" />
                  Contact
                </a>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-dark-5">
              <CalendarDays className="h-3 w-3" />
              Added: 09 Jan 2025, 07:00 PM
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferBidDetail;
