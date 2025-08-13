// src/components/role-homes/SellerHome.tsx
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const StatCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-4">
    <div className="text-gray-500 text-sm">{label}</div>
    <div className="text-xl font-semibold">{value}</div>
  </div>
);

const SellerHome: React.FC<{ name: string; sellerId?: string }> = ({ name, sellerId }) => {
  const navigate = useNavigate();

  // TODO: replace with API data
  const stats = useMemo(() => ({
    brandName: 'Ghana Spare Parts Intl.',
    rating: 4.5,
    totalOrders: 50,
    totalProducts: 25,
    earningsToday: 50,
    series: [60, 120, 200, 500, 200, 150],
    dayLabel: 'June 28th',
  }), []);

  return (
    <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0 py-6 pt-20">
      <h1 className="text-2xl font-semibold mb-5">Home</h1>

      {/* Brand / rating card */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 mb-5">
        <img src="/images/placeholder-brand.png" className="w-10 h-10 rounded" alt="brand" />
        <div className="flex-1">
          <p className="font-medium">{stats.brandName}</p>
          <div className="flex items-center gap-1 text-sm text-amber-500">
            <span>⭐</span><span className="text-gray-700">{stats.rating}</span>
          </div>
        </div>
        {/* {sellerId && (
          <button
            onClick={() => navigate(`/95668339501103956045/seller/${sellerId}/profile`)}
            className="text-blue text-sm hover:underline"
          >
            View profile
          </button>
        )} */}
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <StatCard label="Total orders" value={String(stats.totalOrders)} />
        <StatCard label="Total products" value={String(stats.totalProducts)} />
      </div>

      {/* Actions */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between mb-5">
        <div className="text-gray-700">Add new product</div>
        {sellerId && (
          <button
            onClick={() => navigate(`/95668339501103956045/seller/${sellerId}/products/new`)}
            className="px-3 py-2 text-sm rounded-lg bg-violet-600 text-white hover:bg-violet-700"
          >
            + Add product
          </button>
        )}
      </div>

      {/* Lightweight “chart” */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-gray-700">{stats.dayLabel}</div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Daily</span>
            <span className="text-xs text-gray-400">▼</span>
          </div>
        </div>
        <div className="h-28 relative">
          <div className="absolute inset-0 flex items-end gap-1 px-1">
            {stats.series.map((v, i) => (
              <div key={i} className="bg-blue/30 rounded-t" style={{ height: `${Math.min(100, v / 6)}%`, width: '12%' }} />
            ))}
          </div>
          <div className="absolute left-1/2 top-2 h-[calc(100%-0.5rem)] w-[1px] bg-amber-400" />
          <div className="absolute left-1/2 -translate-x-1/2 top-0 text-xs bg-white px-1 rounded border border-gray-200">
            GH₵ {stats.earningsToday}
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-6">Signed in as <span className="font-medium">{name}</span></p>
    </div>
  );
};

export default SellerHome;
