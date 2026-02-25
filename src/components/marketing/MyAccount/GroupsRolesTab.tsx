import React from 'react';
import { Users, Shield, Tag } from 'lucide-react';

const GroupsRolesTab: React.FC<{ groups: any[]; roles: any[] }> = ({ groups, roles }) => (
  <div>
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-dark">Groups & Roles</h3>
      <p className="text-sm text-dark-4 mt-1">Your assigned groups and permission roles</p>
    </div>

    {/* Groups */}
    <div className="bg-gray-1 rounded-xl border border-gray-3 p-5 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Users className="h-4 w-4 text-dark-4" />
        <p className="text-sm font-semibold text-dark">Groups</p>
      </div>
      {groups.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {groups.map((g, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-light-5 text-blue px-3 py-1.5 rounded-full"
            >
              <Tag className="h-3 w-3" />
              {typeof g === 'string' ? g : g?.name ?? JSON.stringify(g)}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-dark-4">No groups assigned</p>
      )}
    </div>

    {/* Roles */}
    <div className="bg-gray-1 rounded-xl border border-gray-3 p-5">
      <div className="flex items-center gap-2 mb-3">
        <Shield className="h-4 w-4 text-dark-4" />
        <p className="text-sm font-semibold text-dark">Roles</p>
      </div>
      {roles.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {roles.map((r, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 text-xs font-medium bg-green-50 text-green-700 px-3 py-1.5 rounded-full"
            >
              <Shield className="h-3 w-3" />
              {typeof r === 'string' ? r : r?.name ?? JSON.stringify(r)}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-dark-4">No roles assigned</p>
      )}
    </div>
  </div>
);

export default GroupsRolesTab;
