/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';

import { useAuth } from '@/features/auth';
import { uploadRiderLicenseBackSelf, uploadRiderLicenseFrontSelf, uploadRiderVehicleFrontSelf } from '@/lib/profiling';

const RiderDocumentsTab: React.FC = () => {
  const { authData } = useAuth();
  const deliverFromAuth = authData?.user?.deliver || null;

  const [localDeliver, setLocalDeliver] = useState<any | null>(deliverFromAuth);
  useEffect(() => {
    setLocalDeliver(deliverFromAuth);
  }, [deliverFromAuth]);

  const [licenseFront, setLicenseFront] = useState<File | null>(null);
  const [licenseBack, setLicenseBack] = useState<File | null>(null);
  const [vehicleFront, setVehicleFront] = useState<File | null>(null);
  const [vehicleId, setVehicleId] = useState<string>('');

  const vehicles: any[] = localDeliver?.vehicles ?? [];
  const hasDeliver = Boolean(localDeliver?.Deliver_ID);
  const canUploadVehicle = useMemo(() => !!vehicleId && !!vehicleFront, [vehicleId, vehicleFront]);

  if (!localDeliver) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-sm">No rider profile found.</p>
      </div>
    );
  }

  const patchDeliver = (patch: Partial<any>) => {
    setLocalDeliver((prev: any) => (prev ? { ...prev, ...patch } : prev));
  };

  const patchVehicleById = (vid: string, patch: Partial<any>) => {
    setLocalDeliver((prev: any) => {
      if (!prev) {
        return prev;
      }
      const nextVehicles = (prev.vehicles ?? []).map((v: any) => (v.Vehicle_ID === vid ? { ...v, ...patch } : v));
      return { ...prev, vehicles: nextVehicles };
    });
  };

  const doUploadLicenseFront = async () => {
    if (!hasDeliver || !licenseFront) {
      return;
    }
    const toastId = toast.loading('Uploading license (front)...', { position: 'bottom-center' });
    try {
      const f = new FormData();
      f.append('Deliver_ID', localDeliver!.Deliver_ID);
      f.append('Image_Type', 'LICENSE_FRONT');
      f.append('file', licenseFront);
      const res = await uploadRiderLicenseFrontSelf(f);
      const url = res?.data?.url || res?.data?.front_license_url || res?.front_license_url || null;
      patchDeliver({ front_license_url: url ?? localDeliver!.front_license_url });
      toast.success('License (front) uploaded.', { id: toastId, position: 'bottom-center' });
      setLicenseFront(null);
    } catch (e) {
      console.error(e);
      toast.error('Upload failed.', { id: toastId, position: 'bottom-center' });
    }
  };

  const doUploadLicenseBack = async () => {
    if (!hasDeliver || !licenseBack) {
      return;
    }
    const toastId = toast.loading('Uploading license (back)...', { position: 'bottom-center' });
    try {
      const f = new FormData();
      f.append('Deliver_ID', localDeliver!.Deliver_ID);
      f.append('Image_Type', 'LICENSE_BACK');
      f.append('file', licenseBack);
      const res = await uploadRiderLicenseBackSelf(f);
      const url = res?.data?.url || res?.data?.back_license_url || res?.back_license_url || null;
      patchDeliver({ back_license_url: url ?? localDeliver!.back_license_url });
      toast.success('License (back) uploaded.', { id: toastId, position: 'bottom-center' });
      setLicenseBack(null);
    } catch (e) {
      console.error(e);
      toast.error('Upload failed.', { id: toastId, position: 'bottom-center' });
    }
  };

  const doUploadVehicleFront = async () => {
    if (!vehicleId || !vehicleFront) {
      return;
    }
    const toastId = toast.loading('Uploading vehicle photo...', { position: 'bottom-center' });
    try {
      const f = new FormData();
      f.append('Vehicle_ID', vehicleId);
      f.append('Image_Type', 'VEHICLE_FRONT');
      f.append('file', vehicleFront);
      const res = await uploadRiderVehicleFrontSelf(f);
      const url = res?.data?.url || res?.data?.front_image_url || res?.front_image_url || null;
      patchVehicleById(vehicleId, { front_image_url: url });
      toast.success('Vehicle photo uploaded.', { id: toastId, position: 'bottom-center' });
      setVehicleFront(null);
    } catch (e) {
      console.error(e);
      toast.error('Upload failed.', { id: toastId, position: 'bottom-center' });
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Rider Documents</h2>

      {/* Driver's License Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Driver's License</h3>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Front */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Front</p>
            {localDeliver?.front_license_url ? (
              <img
                src={localDeliver.front_license_url}
                alt="License front"
                className="w-full max-w-xs rounded-lg border border-gray-200 object-cover"
              />
            ) : (
              <div className="w-full max-w-xs h-32 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                <span className="text-xs text-gray-400">No image uploaded</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLicenseFront(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue/10 file:text-blue hover:file:bg-blue/20 transition"
              disabled={!hasDeliver}
            />
            <button
              onClick={doUploadLicenseFront}
              disabled={!hasDeliver || !licenseFront}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium py-2 px-5 rounded-xl shadow-sm hover:opacity-90 transition disabled:opacity-40"
            >
              Upload Front
            </button>
          </div>

          {/* Back */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">Back</p>
            {localDeliver?.back_license_url ? (
              <img
                src={localDeliver.back_license_url}
                alt="License back"
                className="w-full max-w-xs rounded-lg border border-gray-200 object-cover"
              />
            ) : (
              <div className="w-full max-w-xs h-32 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                <span className="text-xs text-gray-400">No image uploaded</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLicenseBack(e.target.files?.[0] ?? null)}
              className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue/10 file:text-blue hover:file:bg-blue/20 transition"
              disabled={!hasDeliver}
            />
            <button
              onClick={doUploadLicenseBack}
              disabled={!hasDeliver || !licenseBack}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium py-2 px-5 rounded-xl shadow-sm hover:opacity-90 transition disabled:opacity-40"
            >
              Upload Back
            </button>
          </div>
        </div>
      </div>

      {/* Vehicle Photos Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Vehicle Photos</h3>

        {vehicles.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No vehicles on file.</p>
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {vehicles.map((v: any) => (
              <div key={v.Vehicle_ID} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-10 h-10 rounded-lg bg-blue/10 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800">{v.model}</p>
                  <p className="text-xs text-gray-500">{v.registrationNumber}</p>
                  <div className="mt-3">
                    {v.front_image_url ? (
                      <img src={v.front_image_url} alt="Vehicle front" className="max-w-[200px] rounded-lg border border-gray-200" />
                    ) : (
                      <div className="inline-flex items-center gap-1.5 text-xs text-gray-400">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75a1.5 1.5 0 00-1.5 1.5v13.5a1.5 1.5 0 001.5 1.5z"
                          />
                        </svg>
                        No photo uploaded
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload vehicle photo */}
        {vehicles.length > 0 && (
          <div className="border-t border-gray-100 pt-5">
            <p className="text-sm font-medium text-gray-700 mb-3">Upload Vehicle Photo</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Select Vehicle</label>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue transition bg-white"
                  disabled={vehicles.length === 0}
                >
                  <option value="" disabled>
                    Choose a vehicle
                  </option>
                  {vehicles.map((v: any) => (
                    <option key={v.Vehicle_ID} value={v.Vehicle_ID}>
                      {v.model} - {v.registrationNumber}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-1.5">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setVehicleFront(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue/10 file:text-blue hover:file:bg-blue/20 transition"
                  disabled={!vehicleId}
                />
              </div>
            </div>
            <button
              onClick={doUploadVehicleFront}
              disabled={!canUploadVehicle}
              className="mt-4 inline-flex items-center gap-2 bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium py-2 px-5 rounded-xl shadow-sm hover:opacity-90 transition disabled:opacity-40"
            >
              Upload Vehicle Photo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiderDocumentsTab;
