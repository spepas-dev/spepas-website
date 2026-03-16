/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useAuth } from '@/features/auth';
import { uploadSellerDocSelf } from '@/lib/profiling';

const SellerDocumentsTab: React.FC = () => {
  const { authData } = useAuth();
  const sellerFromAuth = authData?.user?.sellerDetails || null;

  const [localSeller, setLocalSeller] = useState<any | null>(sellerFromAuth);
  useEffect(() => {
    setLocalSeller(sellerFromAuth);
  }, [sellerFromAuth]);

  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);

  if (!localSeller) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-sm">No seller profile found.</p>
      </div>
    );
  }

  const onUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!files || files.length === 0) {
      toast.error('Please select at least one document.', { position: 'bottom-center' });
      return;
    }
    if (!localSeller.Seller_ID) {
      toast.error('No Seller_ID found on your profile.', { position: 'bottom-center' });
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Uploading document(s)...', { position: 'bottom-center' });
    try {
      const form = new FormData();
      form.append('Seller_ID', localSeller.Seller_ID);
      Array.from(files).forEach((f) => form.append('file', f));

      const res = await uploadSellerDocSelf(form);

      const firstUrl = res?.data?.urls?.[0] || res?.data?.business_reg_url || res?.business_reg_url || localSeller.business_reg_url || null;

      setLocalSeller((prev: any) =>
        prev ? { ...prev, business_reg_url: firstUrl, business_reg_obj: res?.data?.business_reg_obj ?? prev.business_reg_obj } : prev
      );

      toast.success('Document(s) uploaded.', { id: toastId, position: 'bottom-center' });
      setFiles(null);
    } catch (err) {
      console.error(err);
      toast.error('Upload failed.', { id: toastId, position: 'bottom-center' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Seller Documents</h2>

      {/* Current Document */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Current Document</h3>
        {localSeller.business_reg_url ? (
          <div>
            {/\.(png|jpe?g|gif|webp)$/i.test(localSeller.business_reg_url) ? (
              <img src={localSeller.business_reg_url} alt="Business document" className="max-w-xs rounded-lg border border-gray-200" />
            ) : (
              <a
                href={localSeller.business_reg_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-blue hover:underline"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
                View current document
              </a>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 py-6">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">No document uploaded yet.</p>
              <p className="text-xs text-gray-400 mt-0.5">Upload your business registration below.</p>
            </div>
          </div>
        )}
      </div>

      {/* Upload Form */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Upload Document</h3>
        <form onSubmit={onUpload} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Files</label>
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={(e) => setFiles(e.target.files)}
              className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue/10 file:text-blue hover:file:bg-blue/20 transition"
            />
            <p className="text-xs text-gray-400 mt-1.5">Accepted formats: Images or PDF</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium py-2.5 px-6 rounded-xl shadow-sm hover:opacity-90 transition disabled:opacity-40"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerDocumentsTab;
