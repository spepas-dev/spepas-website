// src/components/role-homes/SellerHome.tsx
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  Star,
  ShoppingCart,
  Package,
  Plus,
  TrendingUp,
  ChevronDown,
} from 'lucide-react';

const StatCard: React.FC<{
  label: string;
  value: string;
  icon: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-5 flex items-center gap-4">
    <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-xs text-dark-4">{label}</p>
      <p className="text-xl font-bold text-dark mt-0.5">{value}</p>
    </div>
  </div>
);

const SellerHome: React.FC<{ name: string; sellerId?: string }> = ({
  name,
  sellerId,
}) => {
  const navigate = useNavigate();

  // TODO: replace with API data
  const stats = useMemo(
    () => ({
      brandName: 'Ghana Spare Parts Intl.',
      rating: 4.5,
      totalOrders: 50,
      totalProducts: 25,
      earningsToday: 50,
      series: [60, 120, 200, 500, 200, 150],
      dayLabel: 'June 28th',
    }),
    []
  );

  return (
    <section className="pt-24 pb-10 sm:pt-28 sm:pb-16 bg-gray-1 min-h-screen">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
        {/* Page header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-blue-light-5 flex items-center justify-center">
            <Store className="h-5 w-5 text-blue" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-dark">
              Seller Dashboard
            </h1>
            <p className="text-sm text-dark-4">
              Welcome back, {name}
            </p>
          </div>
        </div>

        {/* Brand / rating card */}
        <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-5 flex items-center gap-4 mb-5">
          <div className="h-12 w-12 rounded-xl bg-blue-light-5 flex items-center justify-center shrink-0">
            <Store className="h-6 w-6 text-blue" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-dark truncate">
              {stats.brandName}
            </p>
            <div className="flex items-center gap-1.5 mt-1">
              <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-medium text-dark-2">
                {stats.rating}
              </span>
              <span className="text-xs text-dark-4">/ 5.0</span>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <StatCard
            label="Total Orders"
            value={String(stats.totalOrders)}
            icon={<ShoppingCart className="h-5 w-5 text-blue" />}
          />
          <StatCard
            label="Total Products"
            value={String(stats.totalProducts)}
            icon={<Package className="h-5 w-5 text-blue" />}
          />
        </div>

        {/* Add product action */}
        <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-5 flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-medium text-dark">Add New Product</p>
            <p className="text-xs text-dark-4 mt-0.5">
              List a spare part in your store
            </p>
          </div>
          {sellerId && (
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/95668339501103956045/seller/${sellerId}/products/new`
                )
              }
              className="inline-flex items-center gap-2 bg-blue text-white font-medium text-sm py-2.5 px-5 rounded-xl hover:bg-blue-dark transition-colors duration-200"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          )}
        </div>

        {/* Earnings chart */}
        <div className="bg-white rounded-2xl border border-gray-3 shadow-1 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue" />
              <span className="text-sm font-medium text-dark">
                Earnings Overview
              </span>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 bg-gray-1 text-dark-2 font-medium text-xs py-1.5 px-3 rounded-lg border border-gray-3 hover:bg-gray-2 transition-colors duration-200"
            >
              {stats.dayLabel}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Chart area */}
          <div className="h-32 relative">
            <div className="absolute inset-0 flex items-end gap-1.5 px-1">
              {stats.series.map((v, i) => (
                <div
                  key={i}
                  className="bg-blue/20 hover:bg-blue/40 rounded-t transition-colors duration-200"
                  style={{
                    height: `${Math.min(100, v / 6)}%`,
                    width: '14%',
                  }}
                />
              ))}
            </div>

            {/* Earnings indicator */}
            <div className="absolute left-1/2 top-2 h-[calc(100%-0.5rem)] w-px bg-blue/40" />
            <div className="absolute left-1/2 -translate-x-1/2 top-0 text-[10px] font-medium bg-blue text-white px-2.5 py-1 rounded-full">
              GH&#x20B5; {stats.earningsToday}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellerHome;
