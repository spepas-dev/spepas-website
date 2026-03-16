import React, { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ProofOfDelivery: React.FC = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const onPick = () => inputRef.current?.click();
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = () => setPreview(String(reader.result));
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h2 className="text-xl font-semibold mb-1">Submit proof of delivery</h2>
      <p className="text-sm text-gray-600 mb-4">Please take a picture at destination and submit it to us.</p>

      {!preview ? (
        <div className="border-2 border-dashed rounded-xl p-10 text-center">
          <div className="text-sm text-gray-600 mb-3">Upload picture</div>
          <button className="px-4 py-2 rounded-lg bg-violet-600 text-white" onClick={onPick}>
            Take picture
          </button>
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onChange} />
        </div>
      ) : (
        <div className="space-y-4">
          <img src={preview} alt="proof" className="w-40 h-40 object-cover rounded-xl" />
          <div className="flex gap-3">
            <button
              className="px-4 py-2 rounded-lg border"
              onClick={() => {
                setPreview(null);
                setFile(null);
              }}
            >
              Retake picture
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-violet-600 text-white"
              onClick={() => navigate(`/95668339501103956045/rider/orders/${orderId}/proof-submit`, { state: { preview } })}
              disabled={!file}
            >
              Submit picture
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProofOfDelivery;
