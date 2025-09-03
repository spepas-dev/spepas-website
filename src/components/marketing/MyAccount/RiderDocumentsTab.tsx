import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast'; // *adjusted*
import { useAuth } from '@/features/auth';
import {
  uploadRiderLicenseFrontSelf,
  uploadRiderLicenseBackSelf,
  uploadRiderVehicleFrontSelf,
} from '@/lib/profiling';

const RiderDocumentsTab: React.FC = () => {
  const { authData } = useAuth();
  const deliverFromAuth = authData?.user?.deliver || null;

  // Keep a local, UI-only copy so we can reflect uploads immediately
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

  const canUploadVehicle = useMemo(
    () => !!vehicleId && !!vehicleFront,
    [vehicleId, vehicleFront]
  );

  if (!localDeliver) {
    return <p>No rider profile found.</p>;
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
    const toastId = toast.loading('Uploading license (front)…', { position: 'bottom-center' }); // *adjusted*
    try {
      const f = new FormData();
      f.append('Deliver_ID', localDeliver!.Deliver_ID);
      f.append('Image_Type', 'LICENSE_FRONT');
      f.append('file', licenseFront);
      const res = await uploadRiderLicenseFrontSelf(f);

      const url =
        res?.data?.url ||
        res?.data?.front_license_url ||
        res?.front_license_url ||
        null;

      patchDeliver({ front_license_url: url ?? localDeliver!.front_license_url });
      toast.success('License (front) uploaded.', { id: toastId, position: 'bottom-center' }); // *adjusted*
      setLicenseFront(null);
    } catch (e) {
      console.error(e);
      toast.error('Upload failed.', { id: toastId, position: 'bottom-center' }); // *adjusted*
    }
  };

  const doUploadLicenseBack = async () => {
    if (!hasDeliver || !licenseBack) return;
    const toastId = toast.loading('Uploading license (back)…', { position: 'bottom-center' }); // *adjusted*
    try {
      const f = new FormData();
      f.append('Deliver_ID', localDeliver!.Deliver_ID);
      f.append('Image_Type', 'LICENSE_BACK');
      f.append('file', licenseBack);
      const res = await uploadRiderLicenseBackSelf(f);

      const url =
        res?.data?.url ||
        res?.data?.back_license_url ||
        res?.back_license_url ||
        null;

      patchDeliver({ back_license_url: url ?? localDeliver!.back_license_url });
      toast.success('License (back) uploaded.', { id: toastId, position: 'bottom-center' }); // *adjusted*
      setLicenseBack(null);
    } catch (e) {
      console.error(e);
      toast.error('Upload failed.', { id: toastId, position: 'bottom-center' }); // *adjusted*
    }
  };

  const doUploadVehicleFront = async () => {
    if (!vehicleId || !vehicleFront) return;
    const toastId = toast.loading('Uploading vehicle photo…', { position: 'bottom-center' }); // *adjusted*
    try {
      const f = new FormData();
      f.append('Vehicle_ID', vehicleId);
      f.append('Image_Type', 'VEHICLE_FRONT');
      f.append('file', vehicleFront);
      const res = await uploadRiderVehicleFrontSelf(f);

      const url =
        res?.data?.url ||
        res?.data?.front_image_url ||
        res?.front_image_url ||
        null;

      patchVehicleById(vehicleId, { front_image_url: url });
      toast.success('Vehicle photo uploaded.', { id: toastId, position: 'bottom-center' }); // *adjusted*
      setVehicleFront(null);
    } catch (e) {
      console.error(e);
      toast.error('Upload failed.', { id: toastId, position: 'bottom-center' }); // *adjusted*
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Rider Documents</h3>

      {/* License Block */}
      <div className="mb-6 p-4 border rounded-lg">
        <p className="font-medium mb-3">Driver’s License</p>

        <div className="grid md:grid-cols-2 gap-4">
          {/* FRONT */}
          <div className="p-3 border rounded">
            <p className="font-medium mb-2">Front</p>
            {localDeliver?.front_license_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={localDeliver.front_license_url}
                alt="License front"
                className="max-w-xs rounded border mb-3"
              />
            ) : (
              <p className="text-gray-500 mb-3">No front license uploaded.</p>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLicenseFront(e.target.files?.[0] ?? null)}
              className="w-full border rounded px-3 py-2"
              disabled={!hasDeliver}
            />
            <button
              onClick={doUploadLicenseFront}
              disabled={!hasDeliver || !licenseFront}
              className="mt-2 bg-dark text-white px-4 py-2 rounded"
            >
              Upload Front
            </button>
          </div>

          {/* BACK */}
          <div className="p-3 border rounded">
            <p className="font-medium mb-2">Back</p>
            {localDeliver?.back_license_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={localDeliver.back_license_url}
                alt="License back"
                className="max-w-xs rounded border mb-3"
              />
            ) : (
              <p className="text-gray-500 mb-3">No back license uploaded.</p>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLicenseBack(e.target.files?.[0] ?? null)}
              className="w-full border rounded px-3 py-2"
              disabled={!hasDeliver}
            />
            <button
              onClick={doUploadLicenseBack}
              disabled={!hasDeliver || !licenseBack}
              className="mt-2 bg-dark text-white px-4 py-2 rounded"
            >
              Upload Back
            </button>
          </div>
        </div>
      </div>

      {/* Vehicle Block */}
      <div className="p-4 border rounded-lg">
        <p className="font-medium mb-3">Vehicle Photos</p>

        {/* Show list of vehicles & current images */}
        {vehicles.length === 0 ? (
          <p className="text-gray-500 mb-4">No vehicles on file.</p>
        ) : (
          <ul className="mb-4 space-y-3">
            {vehicles.map((v: any) => (
              <li key={v.Vehicle_ID} className="p-3 border rounded">
                <p className="font-medium">
                  {v.model} • {v.registrationNumber}
                </p>
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Front Photo:</p>
                  {v.front_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={v.front_image_url}
                      alt="Vehicle front"
                      className="max-w-xs rounded border"
                    />
                  ) : (
                    <p className="text-gray-500">Not uploaded.</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Upload new vehicle front */}
        <div className="grid md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block mb-1 font-medium">Select Vehicle</label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full border rounded px-3 py-2"
              disabled={vehicles.length === 0}
            >
              <option value="" disabled>
                {vehicles.length ? 'Choose a vehicle' : 'No vehicles found'}
              </option>
              {vehicles.map((v: any) => (
                <option key={v.Vehicle_ID} value={v.Vehicle_ID}>
                  {v.model} • {v.registrationNumber}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Front Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setVehicleFront(e.target.files?.[0] ?? null)}
              className="w-full border rounded px-3 py-2"
              disabled={!vehicleId}
            />
            <button
              onClick={doUploadVehicleFront}
              disabled={!canUploadVehicle}
              className="mt-2 bg-dark text-white px-4 py-2 rounded"
            >
              Upload Vehicle Photo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiderDocumentsTab;
