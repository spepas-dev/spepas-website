import React from 'react';

interface Props {
  vehicleSummary: string;
  total: number;
}

const VehicleBanner: React.FC<Props> = ({ vehicleSummary, total }) => (
  <div className="flex items-center gap-2.5 bg-[var(--color-primary-50)] border border-[var(--color-primary-100)] rounded-lg px-4 py-2.5 mb-6">
    <svg
      className="w-5 h-5 text-[var(--color-primary-400)] shrink-0"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-6.867c0-.298-.119-.585-.33-.796l-3.525-3.525A1.125 1.125 0 0016.618 6H15m-3 0H9.375a1.125 1.125 0 00-1.125 1.125v11.25"
      />
    </svg>
    <span className="text-sm font-semibold text-[var(--color-primary-700)]">{vehicleSummary}</span>
    <span className="text-xs text-[var(--color-primary-400)] ml-auto hidden sm:inline">
      {total.toLocaleString()} part{total !== 1 ? 's' : ''} available
    </span>
  </div>
);

export default VehicleBanner;
