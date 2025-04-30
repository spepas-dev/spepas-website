import React from 'react';

interface OfferCardProps {
  offer: any;
  inCart: boolean;
  onAdd: (biddingId: string) => void;
  onRemove: (biddingId: string) => void;
}

const OfferCard: React.FC<OfferCardProps> = ({
  offer,
  inCart,
  onAdd,
  onRemove,
}) => {
//   const img = offer.seller.business_reg_url;

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <div className="flex items-center mb-2">
        {/* {img && (
          <img
            src={img}
            alt=""
            className="w-12 h-12 rounded-full mr-3 object-cover"
          />
        )} */}
        <div className="flex-grow">
          <p className="font-semibold">{offer.seller.storeName}</p>
          <p>GH₵ {offer.totalPrice}</p>
        </div>
        {inCart ? (
          <button
            onClick={() => onRemove(offer.bidding_ID)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Remove
          </button>
        ) : (
          <button
            onClick={() => onAdd(offer.bidding_ID)}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Add
          </button>
        )}
      </div>
    </div>
  );
};

export default OfferCard;
