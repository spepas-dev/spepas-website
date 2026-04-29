// src/components/buyer/PinConfirmModal.tsx
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PinConfirmModalProps {
  open: boolean;
  submitting: boolean;
  amountLabel?: string;
  errorMessage?: string;
  onCancel: () => void;
  onConfirm: (pin: string) => void;
}

const PIN_REGEX = /^[0-9]{4,6}$/;

const PinConfirmModal: React.FC<PinConfirmModalProps> = ({
  open,
  submitting,
  amountLabel,
  errorMessage,
  onCancel,
  onConfirm,
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [localError, setLocalError] = useState<string | undefined>();

  useEffect(() => {
    if (!open) {
      setPin('');
      setLocalError(undefined);
      setShowPin(false);
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value.replace(/\D/g, '').slice(0, 6);
    setPin(next);
    if (localError) setLocalError(undefined);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!PIN_REGEX.test(pin)) {
      setLocalError('Enter a 4 to 6 digit PIN.');
      return;
    }
    onConfirm(pin);
  };

  const displayError = localError || errorMessage;
  const isPinNotSet =
    typeof errorMessage === 'string' &&
    /pin\s*not\s*set/i.test(errorMessage);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-gray-900/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="pin-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-5">
        <div className="text-center space-y-1">
          <h3 id="pin-modal-title" className="text-lg font-semibold text-gray-900">
            Confirm with Transaction PIN
          </h3>
          {amountLabel && (
            <p className="text-sm text-gray-500">
              Authorise <span className="font-medium text-gray-900">{amountLabel}</span> from your wallet.
            </p>
          )}
        </div>

        {isPinNotSet ? (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            You haven't set a transaction PIN yet.{' '}
            <Link
              to="/95668339501103956045/auth/setup-pin"
              className="font-medium underline"
              onClick={onCancel}
            >
              Set it up here
            </Link>
            , then return to checkout.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="checkout-pin" className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                PIN
              </label>
              <div className="relative">
                <input
                  id="checkout-pin"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="••••"
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={handleChange}
                  autoFocus
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPin((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
                  aria-label={showPin ? 'Hide PIN' : 'Show PIN'}
                >
                  {showPin ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>
              {displayError && (
                <p className="mt-2 text-sm text-red-600">{displayError}</p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !PIN_REGEX.test(pin)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue to-blue-500 text-white text-sm font-medium shadow-sm hover:opacity-90 transition disabled:opacity-40"
              >
                {submitting ? 'Confirming…' : 'Confirm'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PinConfirmModal;
