// src/components/buyer/OfferBidDetail.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const IMAGES: string[] = [
  // Replace with actual URLs later
  'https://www.serac-group.com/wp-content/uploads/2019/09/Parts.jpg',
  'https://thumbs.dreamstime.com/b/set-grey-metal-car-brake-discs-black-pads-photographed-clean-white-background-essential-auto-spare-parts-effective-398612931.jpg',
  'https://blogs.gomechanic.com/wp-content/uploads/2020/07/How-to-spot-Counterfiet-fake-spare-parts-01.jpg',
];

const Badge: React.FC<{ tone?: 'gray' | 'indigo' | 'green' | 'amber'; children: React.ReactNode }> = ({
  children,
  tone = 'gray',
}) => {
  const toneMap = {
    gray: 'bg-gray-100 text-gray-700',
    indigo: 'bg-indigo-100 text-indigo-700',
    green: 'bg-green-100 text-green-700',
    amber: 'bg-amber-100 text-amber-700',
  } as const;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${toneMap[tone]}`}>
      {children}
    </span>
  );
};

const OfferBidDetail: React.FC = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        {/* <button
          onClick={() => navigate(-1)}
          className="rounded-full border px-3 py-1.5 hover:bg-gray-50"
          title="Back"
        >
          ←
        </button> */}
        <h1 className="text-xl sm:text-2xl font-bold">Offer Details</h1>
        <div className="ml-auto">
          <Badge tone="indigo">Pending</Badge>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        {/* IMAGES */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl bg-white  shadow-sm p-3 sm:p-4">
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-gray-100">
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
                  className={`relative overflow-hidden rounded-lg border ${
                    active === i ? 'ring-2 ring-indigo-500' : 'hover:opacity-90'
                  }`}
                  title={`Image ${i + 1}`}
                >
                  <img src={src} className="h-16 w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* DETAILS */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white  shadow-sm p-4 sm:p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">Radiator</h2>
                <p className="text-gray-600 text-sm">Toyota • Camry • 2018</p>
              </div>
              <Badge tone="gray">Qty: 5</Badge>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed">
              Brand new radiator with 12-month warranty. OEM grade fit and finish.
              Ready for immediate pickup or delivery.
            </p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-gray-500">Total Price</div>
                <div className="font-medium">GH₵ 2,500</div>
              </div>
              <div>
                <div className="text-gray-500">Unit Price</div>
                <div className="font-medium">GH₵ 500</div>
              </div>
              <div>
                <div className="text-gray-500">Date Assigned</div>
                <div className="font-medium">01 Oct 2025, 08:55 PM</div>
              </div>
              <div>
                <div className="text-gray-500">Date Accepted</div>
                <div className="font-medium">—</div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-gray-500">Seller</div>
                  <div className="font-medium">A and A Ventures</div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg border hover:bg-gray-50 text-sm">
                    View Store
                  </button>
                  <a
                    href="/95668339501103956045/chat/c1"
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-sm"
                  >
                    Contact
                  </a>
                </div>
              </div>

              <div className="mt-2 text-xs text-gray-500">Coords: 40.7831, -73.9712</div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>Added:</span>
              <span>09 Jan 2025, 07:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfferBidDetail;
