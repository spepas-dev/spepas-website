// src/components/gopa/RequestList.tsx
import React from 'react';

import RequestCard from './RequestCard';

interface Props {
  requests: unknown[];
}

const RequestList: React.FC<Props> = ({ requests }) => (
  <div className="grid gap-4">
    {requests.map((req) => (
      <RequestCard key={req.request_id} request={req} />
    ))}
  </div>
);

export default RequestList;
