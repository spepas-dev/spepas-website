import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getRequestBidsAllAPI,
  addBidToCartAPI,
  removeBidFromCartAPI,
} from '@/lib/orderBidsApis';
import OfferCard from './OfferCard';

const OffersList: React.FC = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const [offers, setOffers] = useState<any[]>([]);
  const [cartMap, setCartMap] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!requestId) return;
    getRequestBidsAllAPI({ request_id: requestId })
      .then(res => setOffers(res.data))
      .catch(console.error);
  }, [requestId]);

  const handleAdd = (b: string) =>
    addBidToCartAPI({ bidding_ID: b })
      .then(res =>
        setCartMap(m => ({
          ...m,
          [b]: res.data.data.cart_ID,
        }))
      )
      .catch(console.error);

  const handleRemove = (b: string) => {
    const cart_ID = cartMap[b];
    if (!cart_ID) return;
    removeBidFromCartAPI({ cart_ID })
      .then(() => {
        setCartMap(m => {
          const nxt = { ...m };
          delete nxt[b];
          return nxt;
        });
      })
      .catch(console.error);
  };

  if (!requestId) return <p>No request selected.</p>;
  if (offers.length === 0) return <p>No offers yet.</p>;

  return (
    <div>
      {offers.map(o => (
        <OfferCard
          key={o.bidding_ID}
          offer={o}
          inCart={!!cartMap[o.bidding_ID]}
          onAdd={handleAdd}
          onRemove={handleRemove}
        />
      ))}
    </div>
  );
};

export default OffersList;
