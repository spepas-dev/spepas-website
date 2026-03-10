import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/features/auth';
import {
  uploadRiderLicenseFrontSelf,
  uploadRiderLicenseBackSelf,
  uploadRiderVehicleFrontSelf,
} from '@/lib/profiling';
import { FileText, Upload, Eye, Image, Car, CreditCard, Loader2 } from 'lucide-react';

const RiderDocumentsTab: React.FC = () => {
  const { authData } = useAuth();
  const deliverFromAuth = authData?.user?.deliver || null;

  const [localDeliver, setLocalDeliver] = useState<any | null>(deliverFromAuth);
  useEffect(() => {
    setLocalDeliver(deliverFromAuth);
  }, [deliverFromAuth]);

  const [licenseFront, setLicenseFront] = useState<File | null>(null);
  const [licenseBack, setLicenseBack] = useState<File | null>(null);
  const [loadingFront, setLoadingFront] = useState(false);
  const [loadingBack, setLoadingBack] = useState(false);

  const [vehicleFront, setVehicleFront] = useState<File | null>(null);
  const [vehicleId, setVehicleId] = useState<string>('');
  const [loadingVehicle, setLoadingVehicle] = useState(false);

  const vehicles: any[] = localDeliver?.vehicles ?? [];
  const hasDeliver = Boolean(localDeliver?.Deliver_ID);

  const canUploadVehicle = useMemo(
    () => !!vehicleId && !!vehicleFront,
    [vehicleId, vehicleFront]
  );

  if (!localDeliver) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-gray-1 rounded-xl border border-gray-3">
        <div className="h-14 w-14 rounded-full bg-gray-2 flex items-center justify-center mb-4">
          <FileText className="h-6 w-6 text-dark-4" />
        </div>
        <p className="text-sm font-medium text-dark-2">No rider profile found</p>
        <p className="text-xs text-dark-4 mt-1">A rider profile is required to manage documents</p>
      </div>
    );
  }

  const patchDeliver = (patch: Partial<any>) => {
    setLocalDeliver((prev: any) => (prev ? { ...prev, ...patch } : prev));
  };

  const patchVehicleById = (vid: string, patch: Partial<any>) => {
    setLocalDeliver((prev: any) => {
      if (!prev) return prev;
      const nextVehicles = (prev.vehicles ?? []).map((v: any) =>
        v.Vehicle_ID === vid ? { ...v, ...patch } : v
      );
      return { ...prev, vehicles: nextVehicles };
    });
  };

  const doUploadLicenseFront = async () => {
    if (!hasDeliver || !licenseFront) return;
    setLoadingFront(true);
    const toastId = toast.loading('Uploading license (front)...', { position: 'bottom-center' });
    try {
      const f = new FormData();
      f.append('Deliver_ID', localDeliver!.Deliver_ID);
      f.append('Image_Type', 'LICENSE_FRONT');
      f.append('file', licenseFront);
      const res = await uploadRiderLicenseFrontSelf(f);

      const url =
        res?.data?.url || res?.data?.front_license_url || res?.front_license_url || null;

      patchDeliver({ front_license_url: url ?? localDeliver!.front_license_url });
      toast.success('License (front) uploaded.', { id: toastId, position: 'bottom-center' });
      setLicenseFront(null);
    } catch (e) {
      console.error(e);
      toast.error('Upload failed.', { id: toastId, position: 'bottom-center' });
    } finally {
      setLoadingFront(false);
    }
  };

  const doUploadLicenseBack = async () => {
    if (!hasDeliver || !licenseBack) return;
    setLoadingBack(true);
    const toastId = toast.loading('Uploading license (back)...', { position: 'bottom-center' });
    try {
      const f = new FormData();
      f.append('Deliver_ID', localDeliver!.Deliver_ID);
      f.append('Image_Type', 'LICENSE_BACK');
      f.append('file', licenseBack);
      const res = await uploadRiderLicenseBackSelf(f);

      const url =
        res?.data?.url || res?.data?.back_license_url || res?.back_license_url || null;

      patchDeliver({ back_license_url: url ?? localDeliver!.back_license_url });
      toast.success('License (back) uploaded.', { id: toastId, position: 'bottom-center' });
      setLicenseBack(null);
    } catch (e) {
      console.error(e);
      toast.error('Upload failed.', { id: toastId, position: 'bottom-center' });
    } finally {
      setLoadingBack(false);
    }
  };

  const doUploadVehicleFront = async () => {
    if (!vehicleId || !vehicleFront) return;
    setLoadingVehicle(true);
    const toastId = toast.loading('Uploading vehicle photo...', { position: 'bottom-center' });
    try {
      const f = new FormData();
      f.append('Vehicle_ID', vehicleId);
      f.append('Image_Type', 'VEHICLE_FRONT');
      f.append('file', vehicleFront);
      const res = await uploadRiderVehicleFrontSelf(f);

      const url =
        res?.data?.url || res?.data?.front_image_url || res?.front_image_url || null;

      patchVehicleById(vehicleId, { front_image_url: url });
      toast.success('Vehicle photo uploaded.', { id: toastId, position: 'bottom-center' });
      setVehicleFront(null);
    } catch (e) {
      console.error(e);
      toast.error('Upload failed.', { id: toastId, position: 'bottom-center' });
    } finally {
      setLoadingVehicle(false);
    }
  };

  const fileInputClasses =
    'w-full rounded-lg border border-gray-3 bg-white py-2.5 px-4 text-sm text-dark file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-light-5 file:text-blue file:text-xs file:font-medium hover:file:bg-blue-light-4 focus:border-blue focus:ring-2 focus:ring-blue/20 outline-none transition cursor-pointer';

  const uploadBtnClasses =
    'mt-3 inline-flex items-center gap-2 bg-blue text-white font-medium text-sm py-2 px-4 rounded-xl hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200';

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-dark">Rider Documents</h3>
        <p className="text-sm text-dark-4 mt-1">Upload your license and vehicle photos</p>
      </div>

      {/* License section */}
      <div className="bg-gray-1 rounded-xl border border-gray-3 p-5 mb-6">
        <p className="text-sm font-semibold text-dark mb-4 flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-dark-4" />
          Driver's License
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Front */}
          <div className="bg-white rounded-lg border border-gray-3 p-4">
            <p className="text-sm font-medium text-dark mb-3">Front</p>
            {localDeliver?.front_license_url ? (
              <div className="relative group inline-block mb-3">
                <img
                  src={localDeliver.front_license_url}
                  alt="License front"
                  className="max-w-full max-h-40 rounded-lg border border-gray-3 shadow-1 object-contain"
                />
                <a
                  href={localDeliver.front_license_url}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 bg-dark/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity"
                >
                  <Eye className="h-6 w-6 text-white" />
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-3 py-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-gray-1 flex items-center justify-center">
                  <Image className="h-5 w-5 text-dark-5" />
                </div>
                <p className="text-sm text-dark-4">No front license uploaded</p>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLicenseFront(e.target.files?.[0] ?? null)}
              className={fileInputClasses}
              disabled={!hasDeliver}
            />
            <button
              onClick={doUploadLicenseFront}
              disabled={!hasDeliver || !licenseFront || loadingFront}
              className={uploadBtnClasses}
            >
              {loadingFront ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
              ) : (
                <><Upload className="h-4 w-4" /> Upload Front</>
              )}
            </button>
          </div>

          {/* Back */}
          <div className="bg-white rounded-lg border border-gray-3 p-4">
            <p className="text-sm font-medium text-dark mb-3">Back</p>
            {localDeliver?.back_license_url ? (
              <div className="relative group inline-block mb-3">
                <img
                  src={localDeliver.back_license_url}
                  alt="License back"
                  className="max-w-full max-h-40 rounded-lg border border-gray-3 shadow-1 object-contain"
                />
                <a
                  href={localDeliver.back_license_url}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 bg-dark/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity"
                >
                  <Eye className="h-6 w-6 text-white" />
                </a>
              </div>
            ) : (
              <div className="flex items-center gap-3 py-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-gray-1 flex items-center justify-center">
                  <Image className="h-5 w-5 text-dark-5" />
                </div>
                <p className="text-sm text-dark-4">No back license uploaded</p>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLicenseBack(e.target.files?.[0] ?? null)}
              className={fileInputClasses}
              disabled={!hasDeliver}
            />
            <button
              onClick={doUploadLicenseBack}
              disabled={!hasDeliver || !licenseBack || loadingBack}
              className={uploadBtnClasses}
            >
              {loadingBack ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
              ) : (
                <><Upload className="h-4 w-4" /> Upload Back</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Vehicle section */}
      <div className="bg-gray-1 rounded-xl border border-gray-3 p-5">
        <p className="text-sm font-semibold text-dark mb-4 flex items-center gap-2">
          <Car className="h-4 w-4 text-dark-4" />
          Vehicle Photos
        </p>

        {/* Vehicle list */}
        {vehicles.length === 0 ? (
          <div className="flex items-center gap-3 py-4 mb-4">
            <div className="h-10 w-10 rounded-lg bg-gray-2 flex items-center justify-center">
              <Car className="h-5 w-5 text-dark-5" />
            </div>
            <p className="text-sm text-dark-4">No vehicles on file</p>
          </div>
        ) : (
          <div className="space-y-3 mb-5">
            {vehicles.map((v: any) => (
              <div key={v.Vehicle_ID} className="bg-white rounded-lg border border-gray-3 p-4 hover:shadow-1 transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-shrink-0 h-8 w-8 rounded-lg bg-blue-light-5 flex items-center justify-center">
                    <Car className="h-4 w-4 text-blue" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-dark">{v.model}</p>
                    <p className="text-xs text-dark-4 font-mono">{v.registrationNumber}</p>
                  </div>
                </div>
                <div className="ml-11">
                  <p className="text-xs text-dark-4 mb-1.5">Front Photo</p>
                  {v.front_image_url ? (
                    <div className="relative group inline-block">
                      <img
                        src={v.front_image_url}
                        alt="Vehicle front"
                        className="max-w-[200px] max-h-32 rounded-lg border border-gray-3 shadow-1 object-contain"
                      />
                      <a
                        href={v.front_image_url}
                        target="_blank"
                        rel="noreferrer"
                        className="absolute inset-0 bg-dark/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity"
                      >
                        <Eye className="h-5 w-5 text-white" />
                      </a>
                    </div>
                  ) : (
                    <p className="text-xs text-dark-5">Not uploaded</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload vehicle photo */}
        <div className="bg-white rounded-lg border border-gray-3 p-4">
          <p className="text-sm font-medium text-dark mb-3 flex items-center gap-2">
            <Upload className="h-4 w-4 text-dark-4" />
            Upload Vehicle Photo
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-dark">Select Vehicle</label>
              <select
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                className="w-full h-11 rounded-lg border border-gray-3 bg-gray-1 px-4 text-sm text-dark focus:border-blue focus:ring-2 focus:ring-blue/20 outline-none transition"
                disabled={vehicles.length === 0}
              >
                <option value="" disabled>
                  {vehicles.length ? 'Choose a vehicle' : 'No vehicles found'}
                </option>
                {vehicles.map((v: any) => (
                  <option key={v.Vehicle_ID} value={v.Vehicle_ID}>
                    {v.model} - {v.registrationNumber}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-dark">Front Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setVehicleFront(e.target.files?.[0] ?? null)}
                className={fileInputClasses}
                disabled={!vehicleId}
              />
            </div>
          </div>
          <button
            onClick={doUploadVehicleFront}
            disabled={!canUploadVehicle || loadingVehicle}
            className={uploadBtnClasses}
          >
            {loadingVehicle ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
            ) : (
              <><Upload className="h-4 w-4" /> Upload Vehicle Photo</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiderDocumentsTab;
