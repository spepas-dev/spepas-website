// src/components/marketing/MyAccount/GroupsRolesTab.tsx
import React from 'react';

const GroupsRolesTab: React.FC<{ groups: unknown[]; roles: unknown[] }> = ({ groups, roles }) => (
  <div className="space-y-4">
    <div>
      <h4 className="font-medium">Groups</h4>
      {groups.length ? groups.join(', ') : <p>None</p>}
    </div>
    <div>
      <h4 className="font-medium">Roles</h4>
      {roles.length ? roles.join(', ') : <p>None</p>}
    </div>
  </div>
);

export default GroupsRolesTab;
