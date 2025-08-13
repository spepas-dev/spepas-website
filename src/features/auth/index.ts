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
  refreshTokenAPI,
} from "../../lib/auth";

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

// Define a user type based on your API response.

// ----- nested profile interfaces -----
export interface GopaProfile {
  id: number;
  Gopa_ID: string;
  Specialties: string[];
  User_ID: string;
  status: number;
  date_added: string;  // ISO
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
  role: string;
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

// The auth state contains the current user and tokens.
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
  login: (payload: SigninPayload) => Promise<void>;
  activateAccount: (payload: ActivateAccountPayload) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (payload: ForgotPasswordPayload) => Promise<any>;
  resetPassword: (payload: ResetPasswordPayload) => Promise<void>;
  changePassword: (payload: ChangePasswordPayload) => Promise<void>;
  refreshAuth: () => Promise<void>;
};

// Create the AuthContext.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A constant key for storing auth state in localStorage.
const STORAGE_KEY = "authData";

/**
 * --------------------------------------------------
 * Global Setter for Auth State
 * --------------------------------------------------
 * This variable will hold a reference to the setAuthData function from the AuthProvider,
 * allowing external modules (e.g., Axios interceptor) to update the auth state.
 */
let globalSetAuthData: ((newAuthData: AuthData) => void) | undefined;
export const getGlobalSetAuthData = (): ((newAuthData: AuthData) => void) | undefined =>
  globalSetAuthData;

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
    return stored ? JSON.parse(stored) : { user: null };
  });

  // Persist any changes to auth state back to localStorage.
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
  }, [authData]);

  // Set the global setter so that external modules (like an Axios interceptor) can update auth state.
  useEffect(() => {
    globalSetAuthData = setAuthData;
  }, [setAuthData]);

  /**
   * Signup: Registers a new user.
   * Does not update auth state (usually verification follows) but returns API data.
   */
  const signup = async (payload: SignupPayload): Promise<any> => {
    try {
      return await signupAPI(payload);
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  /**
   * Login: Authenticates the user and sets the auth state with tokens and user data.
   */
  const login = async (payload: SigninPayload): Promise<void> => {
    try {
      const response = await signinAPI(payload);
      setAuthData(response.data);
    } catch (error) {
      console.error("Signin failed:", error);
      throw error;
      
    }
  };

  /**
   * Activate Account: Verifies the account and updates auth state.
   */
  const activateAccount = async (payload: ActivateAccountPayload): Promise<void> => {
    try {
      const response = await activateAccountAPI(payload);
      setAuthData(response.data);
    } catch (error) {
      console.error("Activate account failed:", error);
      throw error;
    }
  };

  /**
   * Logout: Signs out the user and clears the auth state.
   */
  const logout = async (): Promise<void> => {
    try {
      await signoutAPI();
      setAuthData({ user: null });
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Logout failed:", error);
      throw error;
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
      console.error("Forgot password failed:", error);
      throw error;
    }
  };

  /**
   * Reset Password: Resets the password and, upon success, updates auth state.
   */
  const resetPassword = async (payload: ResetPasswordPayload): Promise<void> => {
    try {
      const response = await resetPasswordAPI(payload);
      setAuthData(response.data);
    } catch (error) {
      console.error("Reset password failed:", error);
      throw error;
    }
  };

  /**
   * Change Password: Changes the user password.
   * Typically no state update is needed unless your API returns new tokens.
   */
  const changePassword = async (
    payload: ChangePasswordPayload
  ): Promise<void> => {
    try {
      await changePasswordAPI(payload);
    } catch (error) {
      console.error("Change password failed:", error);
      throw error;
    }
  };

  /**
   * Refresh Auth: Refreshes tokens and updates auth state.
   */
  const refreshAuth = async (): Promise<void> => {
    try {
      const data = await refreshTokenAPI();
      setAuthData((prev) => ({
        ...prev,
        token: data.newAccessToken,
        refresh_token: data.newRefreshToken,
      }));
    } catch (error) {
      console.error("Refresh token failed:", error);
      // Optionally clear auth state if token refresh fails.
      setAuthData({ user: null });
      localStorage.removeItem(STORAGE_KEY);
      throw error;
    }
  };

  /**
   * Auto-logout after 2 hours of inactivity.
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

    // List of events that constitute “activity”
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
  const value: AuthContextType = {
    authData,
    isAuthenticated: Boolean(authData.user),
    signup,
    login,
    activateAccount,
    logout,
    forgotPassword,
    resetPassword,
    changePassword,
    refreshAuth,
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
