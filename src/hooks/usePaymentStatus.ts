// src/hooks/usePaymentStatus.ts
//
// Watches an invoice until its mobile-money payment settles.
//
// The buyer approves the push prompt on their phone; nothing tells the browser
// when that happens, so we poll the invoice. Polling stops as soon as the
// invoice reaches a terminal state, or when the watch window expires — at which
// point the payment may still complete server-side, so the UI should tell the
// buyer to check their invoices rather than claim a failure.
import { useCallback, useEffect, useRef, useState } from 'react';

import {
  getInvoicePaymentSnapshot,
  PAYMENT_POLL_INTERVAL_MS,
  PAYMENT_POLL_TIMEOUT_MS,
  type PaymentSnapshot,
  type PaymentState
} from '@/lib/paymentApis';

export type PaymentWatchState = PaymentState | 'TIMED_OUT';

interface UsePaymentStatusResult {
  state: PaymentWatchState;
  snapshot: PaymentSnapshot | null;
  /** Seconds left in the watch window; 0 once it has expired. */
  secondsRemaining: number;
  /** Last transport error, if the most recent poll could not reach the API. */
  error: string | null;
  /** Restarts the watch window (used by the "still waiting?" retry button). */
  restart: () => void;
}

export const usePaymentStatus = (
  invoiceId: string | null | undefined,
  options?: { intervalMs?: number; timeoutMs?: number }
): UsePaymentStatusResult => {
  const intervalMs = options?.intervalMs ?? PAYMENT_POLL_INTERVAL_MS;
  const timeoutMs = options?.timeoutMs ?? PAYMENT_POLL_TIMEOUT_MS;

  const [state, setState] = useState<PaymentWatchState>('PENDING');
  const [snapshot, setSnapshot] = useState<PaymentSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(Math.ceil(timeoutMs / 1000));
  const [attempt, setAttempt] = useState(0);

  const restart = useCallback(() => {
    setState('PENDING');
    setError(null);
    setSecondsRemaining(Math.ceil(timeoutMs / 1000));
    setAttempt((a) => a + 1);
  }, [timeoutMs]);

  // Guards against a poll that resolves after the component unmounted or the
  // watch already settled.
  const activeRef = useRef(true);

  useEffect(() => {
    if (!invoiceId) return;

    activeRef.current = true;
    const startedAt = Date.now();
    let timer: number | undefined;

    const tick = async () => {
      if (!activeRef.current) return;

      try {
        const next = await getInvoicePaymentSnapshot(invoiceId);
        if (!activeRef.current) return;

        setSnapshot(next);
        setError(null);

        if (next.state === 'SUCCESS' || next.state === 'FAILED') {
          activeRef.current = false;
          setState(next.state);
          return;
        }
      } catch (err) {
        if (!activeRef.current) return;
        // A blip mid-window is not a payment failure — keep watching and let
        // the timeout be the thing that gives up.
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          'Could not reach the payment service. Retrying…';
        setError(message);
      }

      if (!activeRef.current) return;

      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, timeoutMs - elapsed);
      setSecondsRemaining(Math.ceil(remaining / 1000));

      if (remaining <= 0) {
        activeRef.current = false;
        setState('TIMED_OUT');
        return;
      }

      timer = window.setTimeout(tick, Math.min(intervalMs, remaining));
    };

    // First read fires immediately: the order service's own poller may already
    // have finalised the invoice before the buyer's browser gets here.
    timer = window.setTimeout(tick, 0);

    return () => {
      activeRef.current = false;
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [invoiceId, intervalMs, timeoutMs, attempt]);

  return { state, snapshot, secondsRemaining, error, restart };
};

export default usePaymentStatus;
