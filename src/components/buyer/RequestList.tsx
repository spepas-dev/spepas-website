import React, { useEffect, useState } from 'react';
import { getBuyerActiveRequestsAll, getBuyerRequestHistoryAll } from '@/lib/orderBidsApis';
import RequestCard from './RequestCard';

interface RequestListProps {
  mode: 'active' | 'history';
}

const RequestList: React.FC<RequestListProps> = ({ mode }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fn = mode === 'active'
      ? getBuyerActiveRequestsAll
      : getBuyerRequestHistoryAll;

    fn()
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [mode]);

  if (loading) return <p>Loading…</p>;
  if (data.length === 0) return <p>No {mode} requests.</p>;

  return <>{data.map(r => <RequestCard key={r.request_ID} req={r} />)}</>;
};

export default RequestList;
