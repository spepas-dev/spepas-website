// src/features/auth/SessionGuard.tsx

// SessionGuard is no longer needed because:
// - backend fully manages the session
// - axios global 401 handler redirects to signin on any unauthenticated call
// We keep this file as a harmless stub in case it's imported somewhere.

export default function SessionGuard() {
  return null;
}
