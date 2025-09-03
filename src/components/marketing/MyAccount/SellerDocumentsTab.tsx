import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast'; // *adjusted*
import { useAuth } from '@/features/auth';
import { uploadSellerDocSelf } from '@/lib/profiling';

const SellerDocumentsTab: React.FC = () => {
  const { authData } = useAuth();
  const sellerFromAuth = authData?.user?.sellerDetails || null;

  // Local UI-only copy for immediate reflection after uploads
  const [localSeller, setLocalSeller] = useState<any | null>(sellerFromAuth);
  useEffect(() => {
    setLocalSeller(sellerFromAuth);
  }, [sellerFromAuth]);

  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  if (!localSeller) {
    return <p>No seller profile found.</p>;
  }

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!files || files.length === 0) {
      toast.error('Please select at least one document.', { position: 'bottom-center' }); // *adjusted*
      return;
    }

    if (!localSeller.Seller_ID) {
      toast.error('No Seller_ID found on your profile.', { position: 'bottom-center' }); // *adjusted*
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Uploading document(s)…', { position: 'bottom-center' }); // *adjusted*
    try {
      const form = new FormData();
      form.append('Seller_ID', localSeller.Seller_ID);
      Array.from(files).forEach((f) => form.append('file', f));

      const res = await uploadSellerDocSelf(form);

      // Try to get a URL back from the response; fallback to current
      const firstUrl =
        res?.data?.urls?.[0] ||
        res?.data?.business_reg_url ||
        res?.business_reg_url ||
        localSeller.business_reg_url ||
        null;

      // Update local-only UI state
      setLocalSeller((prev: any) =>
        prev
          ? {
              ...prev,
              business_reg_url: firstUrl,
              business_reg_obj: res?.data?.business_reg_obj ?? prev.business_reg_obj,
            }
          : prev
      );

      toast.success('Document(s) uploaded.', { id: toastId, position: 'bottom-center' }); // *adjusted*
      setFiles(null);
    } catch (err) {
      console.error(err);
      toast.error('Upload failed.', { id: toastId, position: 'bottom-center' }); // *adjusted*
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Seller Documents</h3>

      {/* Existing doc */}
      <div className="mb-6 p-4 border rounded-lg">
        <p className="font-medium mb-2">Current Document:</p>
        {localSeller.business_reg_url ? (
          <div className="space-y-2">
            {/* If it's an image, show preview */}
            {/\.(png|jpe?g|gif|webp)$/i.test(localSeller.business_reg_url) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={localSeller.business_reg_url}
                alt="Business document"
                className="max-w-xs rounded border"
              />
            ) : (
              <a
                href={localSeller.business_reg_url}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline"
              >
                View current document
              </a>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No document uploaded yet.</p>
        )}
      </div>

      {/* Upload form */}
      <h4 className="text-md font-semibold mb-3">Add/Replace Document</h4>
      <form onSubmit={onUpload} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1 font-medium">Files</label>
          <input
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={(e) => setFiles(e.target.files)}
            className="w-full border rounded px-3 py-2"
          />
          <p className="text-xs text-gray-500 mt-1">Images or PDF.</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-dark text-white py-2 px-4 rounded"
        >
          {loading ? 'Uploading…' : 'Upload'}
        </button>
      </form>
    </div>
  );
};

export default SellerDocumentsTab;
