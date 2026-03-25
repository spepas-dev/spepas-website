// src/components/gopa/RequestList.tsx
import React from 'react';

import RequestCard from './RequestCard';

interface Props {
  requests: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const RequestList: React.FC<Props> = ({ requests }) => (
  <div className="space-y-3">
    {requests.map((req) => (
      <RequestCard key={req.bidding_ID ?? req.request_ID ?? req.request_id ?? req.id} request={req} />
    ))}
  </div>
);

export default RequestList;
