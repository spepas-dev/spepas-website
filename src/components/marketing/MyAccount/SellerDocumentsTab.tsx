import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/features/auth';
import { uploadSellerDocSelf } from '@/lib/profiling';
import { FileText, Upload, Eye, Image, Loader2 } from 'lucide-react';

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
      <div className="flex flex-col items-center justify-center py-12 bg-gray-1 rounded-xl border border-gray-3">
        <div className="h-14 w-14 rounded-full bg-gray-2 flex items-center justify-center mb-4">
          <FileText className="h-6 w-6 text-dark-4" />
        </div>
        <p className="text-sm font-medium text-dark-2">No seller profile found</p>
        <p className="text-xs text-dark-4 mt-1">A seller profile is required to manage documents</p>
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

      const firstUrl =
        res?.data?.urls?.[0] ||
        res?.data?.business_reg_url ||
        res?.business_reg_url ||
        localSeller.business_reg_url ||
        null;

      setLocalSeller((prev: any) =>
        prev
          ? {
              ...prev,
              business_reg_url: firstUrl,
              business_reg_obj: res?.data?.business_reg_obj ?? prev.business_reg_obj,
            }
          : prev
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
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-dark">Seller Documents</h3>
        <p className="text-sm text-dark-4 mt-1">Upload and manage your business registration documents</p>
      </div>

      {/* Current document card */}
      <div className="bg-gray-1 rounded-xl border border-gray-3 p-5 mb-6">
        <p className="text-sm font-semibold text-dark mb-3 flex items-center gap-2">
          <FileText className="h-4 w-4 text-dark-4" />
          Current Document
        </p>
        {localSeller.business_reg_url ? (
          <div className="space-y-3">
            {/\.(png|jpe?g|gif|webp)$/i.test(localSeller.business_reg_url) ? (
              <div className="relative group inline-block">
                <img
                  src={localSeller.business_reg_url}
                  alt="Business document"
                  className="max-w-xs rounded-lg border border-gray-3 shadow-1"
                />
                <a
                  href={localSeller.business_reg_url}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 bg-dark/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity"
                >
                  <Eye className="h-6 w-6 text-white" />
                </a>
              </div>
            ) : (
              <a
                href={localSeller.business_reg_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm text-blue hover:text-blue-dark font-medium transition-colors"
              >
                <Eye className="h-4 w-4" />
                View current document
              </a>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3 py-4">
            <div className="h-10 w-10 rounded-lg bg-gray-2 flex items-center justify-center">
              <Image className="h-5 w-5 text-dark-5" />
            </div>
            <p className="text-sm text-dark-4">No document uploaded yet</p>
          </div>
        )}
      </div>

      {/* Upload form */}
      <div className="bg-gray-1 rounded-xl border border-gray-3 p-5">
        <h4 className="text-sm font-semibold text-dark mb-4 flex items-center gap-2">
          <Upload className="h-4 w-4" />
          Add / Replace Document
        </h4>
        <form onSubmit={onUpload} className="space-y-4 max-w-lg">
          <div>
            <label className="block mb-2 text-sm font-medium text-dark">Files</label>
            <input
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={(e) => setFiles(e.target.files)}
              className="w-full h-11 rounded-lg border border-gray-3 bg-white px-4 text-sm text-dark file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-light-5 file:text-blue file:text-xs file:font-medium hover:file:bg-blue-light-4 focus:border-blue focus:ring-2 focus:ring-blue/20 outline-none transition cursor-pointer"
            />
            <p className="text-xs text-dark-5 mt-1.5">Accepted: Images (PNG, JPG) or PDF</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-blue text-white font-medium text-sm py-2.5 px-6 rounded-xl hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerDocumentsTab;
