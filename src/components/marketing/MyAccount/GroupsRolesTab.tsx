import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const GroupsRolesTab: React.FC<{ groups: any[]; roles: any[] }> = ({ groups, roles }) => (
  <div>
    <h2 className="text-xl font-bold text-gray-800 mb-6">Groups & Roles</h2>
    <div className="grid sm:grid-cols-2 gap-6">
      {/* Groups */}
      <div className="bg-white rounded-xl px-5 py-5 shadow-sm border border-gray-100">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Groups</span>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {groups.length > 0 ? (
            groups.map((g, i) => (
              <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue/10 text-blue text-xs font-medium">
                {typeof g === 'string' ? g : (g.name ?? JSON.stringify(g))}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500">No groups assigned</span>
          )}
        </div>
      </div>

      {/* Roles */}
      <div className="bg-white rounded-xl px-5 py-5 shadow-sm border border-gray-100">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">Roles</span>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {roles.length > 0 ? (
            roles.map((r, i) => (
              <span key={i} className="inline-flex items-center px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                {typeof r === 'string' ? r : (r.name ?? JSON.stringify(r))}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-500">No roles assigned</span>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default GroupsRolesTab;
