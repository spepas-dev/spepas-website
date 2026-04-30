// src/lib/onboardingFlow.ts
//
// Single source of truth for "where should the user go next?" during the
// post-auth onboarding chain. The chain is:
//
//   password → PIN → delivery address → home
//
// Steps are skipped when already satisfied. Each completion screen calls
// resolveNextOnboardingStep() and navigates to the returned path (or HOME_PATH
// if everything is done).
import { getMyAddresses } from './addressApis';
import { pinStatusAPI } from './auth';

export type OnboardingFlags = {
  passwordRequired?: boolean;
  pinRequired?: boolean;
};

export const PASSWORD_PATH = '/95668339501103956045/auth/setup-password';
export const PIN_PATH = '/95668339501103956045/auth/setup-pin';
export const ADDRESS_PATH = '/95668339501103956045/auth/setup-address';
export const HOME_PATH = '/95668339501103956045/home';

/**
 * Returns the next onboarding path the user should land on, or null if every
 * required step is satisfied.
 *
 * `flags` lets callers (activate / signin) short-circuit using the
 * password/pin booleans the backend already returned. Mid-flow callers
 * (after individual setup pages succeed) can pass `null` and we'll fetch
 * pin status freshly.
 */
export const resolveNextOnboardingStep = async (
  flags?: OnboardingFlags | null
): Promise<string | null> => {
  // Step 1: password.
  if (flags?.passwordRequired) return PASSWORD_PATH;

  // Step 2: PIN. Prefer the response flag when we have it; otherwise check live.
  if (flags?.pinRequired) return PIN_PATH;
  if (!flags) {
    try {
      const res: any = await pinStatusAPI();
      const data = res?.data ?? res ?? {};
      if (data.pinSet === false) return PIN_PATH;
    } catch {
      // If pin status is unreachable, don't trap the user here.
    }
  }

  // Step 3: delivery address.
  try {
    const list = await getMyAddresses();
    if (list.data.length === 0) return ADDRESS_PATH;
  } catch {
    // If the address service is down, fall through rather than block sign-in.
  }

  return null;
};
