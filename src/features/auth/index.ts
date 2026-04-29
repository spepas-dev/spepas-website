// src/features/auth/index.ts
import * as React from "react";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  ReactElement,
} from "react";

// Import all your API helper functions from lib/auth.ts
import {
  signupAPI,
  signinAPI,
  activateAccountAPI,
  signoutAPI,
  forgotPasswordAPI,
  resetPasswordAPI,
  changePasswordAPI,
  resendActivationAPI,
  setupPinAPI,
  pinStatusAPI,
  // refreshTokenAPI,        // ❌ no longer used
} from "../../lib/auth";

import { registerAuthSetter } from "@/lib/sessionBridge"; // *adjusted*
import { getUserDetailsById } from "@/lib/profiling";     // *adjusted*
// import { decodeUserIdFromToken } from "@/lib/jwt";     // ❌ no longer used

/**
 * --------------------------------------------------
 * Payload Type Definitions for Each Endpoint
 * --------------------------------------------------
 */

// For Signup (User Registration)
export type SignupPayload = {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  user_type: "BUYER";
};

// For Signin (User Login)
export type SigninPayload = {
  email: string;
  password: string;
};

// For Activate Account
export type ActivateAccountPayload = {
  otp: string;
  otpID: string;
};

// Returned by activateAccount + login so callers can route correctly.
export type PostAuthFlags = {
  pinRequired: boolean;
  passwordRequired: boolean;
};

// For Resend Activation OTP (admin-onboarded users land here)
export type ResendActivationPayload = {
  phoneNumber?: string;
  email?: string;
  identifier?: string;
};

// For Setup PIN
export type SetupPinPayload = {
  pin: string;
  confirmPin: string;
};

// For Forgot Password
export type ForgotPasswordPayload = {
  email: string;
};

// For Reset Password
export type ResetPasswordPayload = {
  otp: string;
  otpID: string;
  newPassword: string;
};

// For Change Password
export type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

/**
 * --------------------------------------------------
 * Auth State and Context Types
 * --------------------------------------------------
 */

// ----- nested profile interfaces -----
export interface GopaProfile {
  id: number;
  Gopa_ID: string;
  Specialties: string[];
  User_ID: string;
  status: number;
  date_added: string; // ISO
}

export interface MepaProfile {
  id: number;
  Mepa_ID: string;
  User_ID: string;
  address: string;
  shop_name: string;
  location: { type: string; coordinates: number[] };
  status: number;
  date_added: string;
}

export interface SellerDetails {
  id: number;
  Seller_ID: string;
  storeName: string;
  business_reg_url: string | null;
  business_reg_obj: object | null;
  Location: { type: string; coordinates: number[] };
  Gopa_ID: string | null;
  date_added: string;
  status: number;
}

export interface Vehicle {
  id: number;
  Vehicle_ID: string;
  User_ID: string;
  added_by: string;
  Deliver_ID: string;
  type: string;
  model: string;
  front_image_url: string | null;
  front_image_obj: object | null;
  back_image_url: string | null;
  back_image_obj: object | null;
  color: string;
  registrationNumber: string;
  date_added: string;
  location: any;
  status: number;
}

export interface DeliverProfile {
  id: number;
  Deliver_ID: string;
  User_ID: string;
  added_by: string;
  licenseNumber: string;
  front_license_url: string | null;
  back_license_url: string | null;
  front_license_obj: object | null;
  back_license_obj: object | null;
  location: { type: string; coordinates: number[] };
  status: number;
  date_added: string;
  vehicles: Vehicle[];
}

export interface PaymentAccount {
  id: number;
  Account_ID: string;
  User_ID: string;
  added_by: string;
  mode: string;
  accountNumber: string;
  provider: string;
  name: string;
  date_added: string;
  status: number;
}

export type UserType = {
  name: string;
  email: string;
  phoneNumber: string;
  verificationStatus: number;
  status: number;
  role: string;          // kept for existing code
  Seller_ID: string | null;
  createdAt: string;
  updatedAt: string;

  gopa: GopaProfile | null;
  mepa: MepaProfile | null;
  sellerDetails: SellerDetails | null;
  deliver: DeliverProfile | null;
  paymentAccounts: PaymentAccount[];
  user_groups: any[];
  user_roles: any[];
};

// The auth state contains the current user (tokens unused now, but kept optional).
export type AuthData = {
  user: UserType | null;
  token?: string;
  refresh_token?: string;
};

// The context interface exposes auth state and all auth functions.
export type AuthContextType = {
  authData: AuthData;
  isAuthenticated: boolean;
  signup: (payload: SignupPayload) => Promise<any>;
  login: (payload: SigninPayload) => Promise<PostAuthFlags>;
  activateAccount: (payload: ActivateAccountPayload) => Promise<PostAuthFlags>;
  resendActivation: (payload: ResendActivationPayload) => Promise<any>;
  setupPin: (payload: SetupPinPayload) => Promise<any>;
  refreshPinStatus: () => Promise<{ pinSet: boolean } | null>;
  logout: () => Promise<void>;
  forgotPassword: (payload: ForgotPasswordPayload) => Promise<any>;
  resetPassword: (payload: ResetPasswordPayload) => Promise<void>;
  changePassword: (payload: ChangePasswordPayload) => Promise<void>;
  refreshAuth: () => Promise<void>;  // kept for API compatibility, now a no-op
  refetchUser: () => Promise<void>;  // *adjusted*
};

// Create the AuthContext.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A constant key for storing auth state in localStorage.
const STORAGE_KEY = "authData";

/**
 * --------------------------------------------------
 * Global Setter for Auth State
 * --------------------------------------------------
 */
let globalSetAuthData: ((newAuthData: AuthData) => void) | undefined;
export const getGlobalSetAuthData = (): ((
  newAuthData: AuthData
) => void) | undefined => globalSetAuthData;

/**
 * --------------------------------------------------
 * AuthProvider Component
 * --------------------------------------------------
 */
export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}): ReactElement => {
  // Initialize auth state from localStorage, if available.
  const [authData, setAuthData] = useState<AuthData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { user: null };

    try {
      const parsed: any = JSON.parse(stored);

      // Already in AuthData shape
      if (parsed && typeof parsed === "object" && "user" in parsed) {
        return {
          user: parsed.user ?? null,
          token: parsed.token,
          refresh_token: parsed.refresh_token,
        } as AuthData;
      }

      // OLD shape: { status, message, data: { token, user, refresh_token } }
      if (parsed && typeof parsed === "object" && "data" in parsed) {
        const data = parsed.data || {};
        return {
          user: data.user ?? null,
          token: data.token,
          refresh_token: data.refresh_token,
        } as AuthData;
      }

      // NEW shape (previous version): { status, message, filtered: { user: {...} } }
      if (parsed && typeof parsed === "object" && "filtered" in parsed) {
        const filtered = parsed.filtered || {};
        return {
          user: filtered.user ?? null,
        } as AuthData;
      }
    } catch (e) {
      // console.error("Failed to parse authData from localStorage:", e);
    }

    return { user: null };
  });

  // Persist any changes to auth state back to localStorage.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
  }, [authData]);

  // Set the global setter so that external modules (like an Axios interceptor) can update auth state.
  useEffect(() => {
    globalSetAuthData = setAuthData;
    registerAuthSetter(setAuthData);
  }, [setAuthData]);

  // --- Optionally hydrate authoritative user from backend ---
  const refetchUser = async (): Promise<void> => {
    try {
      const userId =
        (authData?.user as any)?.User_ID ||
        (authData?.user as any)?.id ||
        null;

      if (!userId) return;

      const res = await getUserDetailsById(String(userId));
      const fresh =
        (res as any)?.data?.data ?? (res as any)?.data ?? (res as any) ?? null;

      if (fresh) {
        setAuthData((prev) => ({
          ...(prev ?? { user: null }),
          user: fresh,
        }));
      }
    } catch (e) {
      // console.error("refetchUser failed:", e);
    }
  };

  /**
   * Signup: Registers a new user.
   */
  const signup = async (payload: SignupPayload): Promise<any> => {
    try {
      return await signupAPI(payload);
    } catch (error) {
      // console.error("Signup failed:", error);
      throw error;
    }
  };

  /**
   * Login: Authenticates the user and sets the auth state with user data.
   *
   * Response shape (no tokens):
   * {
   *   "status": 1,
   *   "message": "Success",
   *   "filtered": { "user": { ...full user... } }
   * }
   */
  const login = async (payload: SigninPayload): Promise<PostAuthFlags> => {
    try {
      const apiData: any = await signinAPI(payload); // signinAPI already returns response.data

      const filtered = apiData.filtered || apiData.data || {};
      const nextAuth: AuthData = {
        user: (filtered.user as UserType) ?? null,
      };

      setAuthData(nextAuth);

      return {
        pinRequired: Boolean(filtered.pinRequired),
        passwordRequired: Boolean(filtered.passwordRequired),
      };
    } catch (error) {
      // console.error("Signin failed:", error);
      throw error;
    }
  };

  /**
   * Activate Account: Verifies the account and updates auth state.
   * Assume similar shape to signin (status/message/filtered.user).
   */
  const activateAccount = async (
    payload: ActivateAccountPayload
  ): Promise<PostAuthFlags> => {
    try {
      const apiData: any = await activateAccountAPI(payload);

      const filtered = apiData.filtered || apiData.data || {};
      const nextAuth: AuthData = {
        user: (filtered.user as UserType) ?? null,
      };

      setAuthData(nextAuth);

      return {
        pinRequired: Boolean(filtered.pinRequired),
        passwordRequired: Boolean(filtered.passwordRequired),
      };
    } catch (error) {
      // console.error("Activate account failed:", error);
      throw error;
    }
  };

  const resendActivation = async (
    payload: ResendActivationPayload
  ): Promise<any> => {
    return await resendActivationAPI(payload);
  };

  const setupPin = async (payload: SetupPinPayload): Promise<any> => {
    return await setupPinAPI(payload);
  };

  const refreshPinStatus = async (): Promise<{ pinSet: boolean } | null> => {
    try {
      const res: any = await pinStatusAPI();
      const data = res?.data ?? res ?? null;
      if (!data) return null;
      return { pinSet: Boolean(data.pinSet) };
    } catch {
      return null;
    }
  };

  /**
   * Logout: Signs out the user and clears the auth state.
   */
  const logout = async (): Promise<void> => {
    try {
      await signoutAPI();
    } catch (error) {
      // even if backend says 401/500 here, we still clear local state
      // console.error("Logout failed:", error);
    } finally {
      setAuthData({ user: null });
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  /**
   * Forgot Password: Initiates forgot password process.
   */
  const forgotPassword = async (
    payload: ForgotPasswordPayload
  ): Promise<any> => {
    try {
      return await forgotPasswordAPI(payload);
    } catch (error) {
      // console.error("Forgot password failed:", error);
      throw error;
    }
  };

  /**
   * Reset Password: Resets the password and MAY update auth state.
   * (Kept minimal since response shape not fully specified.)
   */
  const resetPassword = async (
    payload: ResetPasswordPayload
  ): Promise<void> => {
    try {
      const apiData: any = await resetPasswordAPI(payload);

      if (apiData.filtered || apiData.data || apiData.user) {
        const filtered = apiData.filtered || apiData.data || {};
        const nextAuth: AuthData = {
          user: (filtered.user as UserType) ?? apiData.user ?? authData.user,
        };
        setAuthData(nextAuth);
      }
    } catch (error) {
      // console.error("Reset password failed:", error);
      throw error;
    }
  };

  /**
   * Change Password: Changes the user password.
   */
  const changePassword = async (
    payload: ChangePasswordPayload
  ): Promise<void> => {
    try {
      await changePasswordAPI(payload);
    } catch (error) {
      // console.error("Change password failed:", error);
      throw error;
    }
  };

  /**
   * Refresh Auth:
   * With backend-managed sessions and no tokens, there's nothing to refresh on the client.
   * Kept only to satisfy existing callers; it simply resolves.
   */
  const refreshAuth = async (): Promise<void> => {
    return Promise.resolve();
  };

  /**
   * Auto-logout after 2 hours of inactivity.
   * This is still valid: it just calls backend /auth/signout and clears local state.
   */
  useEffect(() => {
    const INACTIVITY_MS = 1000 * 60 * 60 * 2; // 2 hours
    let timer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        logout();
      }, INACTIVITY_MS);
    };

    const activityEvents: (keyof WindowEventMap)[] = [
      "mousemove",
      "mousedown",
      "keypress",
      "touchstart",
      "scroll",
    ];

    activityEvents.forEach((evt) =>
      window.addEventListener(evt, resetTimer)
    );
    resetTimer(); // start the initial timeout

    return () => {
      clearTimeout(timer);
      activityEvents.forEach((evt) =>
        window.removeEventListener(evt, resetTimer)
      );
    };
  }, [logout]);

  // Prepare the context value.
  const safeAuthData: AuthData = authData ?? { user: null };

  const value: AuthContextType = {
    authData: safeAuthData,
    isAuthenticated: Boolean(safeAuthData.user),
    signup,
    login,
    activateAccount,
    resendActivation,
    setupPin,
    refreshPinStatus,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    refreshAuth,
    refetchUser,
  };

  // Since this file remains a .ts file (no JSX), we use React.createElement.
  return React.createElement(AuthContext.Provider, { value }, children);
};

/**
 * Custom hook for consuming the authentication context.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
