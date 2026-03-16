import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const RiderProofSubmitPage: React.FC = () => {
  const { orderId } = useParams();
  const nav = useNavigate();
  const { state } = useLocation() as { state?: { preview?: string } };

  const submit = async () => {
    // TODO: upload to API then mark delivered
    nav(`/rider/orders/${orderId}/delivered-success`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-8">
      <section className="pt-6"></section>
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h2 className="text-xl font-semibold mb-1">Submit proof of delivery</h2>
        <p className="text-sm text-gray-600 mb-4">Please make sure that the package is visible.</p>

        {state?.preview ? (
          <img src={state.preview} alt="proof" className="w-40 h-40 object-cover rounded-xl" />
        ) : (
          <div className="w-40 h-40 bg-gray-100 rounded-xl" />
        )}

        <div className="mt-6 flex gap-3">
          <button className="px-4 py-2 rounded-lg border" onClick={() => nav(-1)}>
            Retake picture
          </button>
          <button className="px-4 py-2 rounded-lg bg-violet-600 text-white" onClick={submit}>
            Submit picture
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiderProofSubmitPage;
