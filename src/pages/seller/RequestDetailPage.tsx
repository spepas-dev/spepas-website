// src/pages/seller/RequestDetailPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { getRequestDetailAPI } from '@/lib/orderBidsApis';

const RequestDetailPage: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const [detail, setDetail] = useState<unknown>(null);

  useEffect(() => {
    if (!requestId) {
      return;
    }
    getRequestDetailAPI({ request_id: requestId })
      .then((res) => setDetail(res.data))
      .catch(console.error);
  }, [requestId]);

  if (!requestId) {
    return <div>Request ID missing in URL</div>;
  }
  if (!detail) {
    return <div>Loading…</div>;
  }

  return <div>{/* render request detail */}</div>;
};

export default RequestDetailPage;
