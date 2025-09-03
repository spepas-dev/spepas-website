// src/lib/sessionBridge.ts  // *new*

export type AuthSetter = (newAuthData: { user: any; token?: string; refresh_token?: string }) => void; // *new*

let setter: AuthSetter | null = null; // *new*

export const registerAuthSetter = (fn: AuthSetter) => { // *new*
  setter = fn;
}; // *new*

export const getAuthSetter = () => setter; // *new*

export const clearAuthEverywhere = () => { // *new*
  try {
    localStorage.removeItem('authData');
  } catch {}
  try {
    setter?.({ user: null });
  } catch {}
}; // *new*
