// import React, { useEffect, useRef } from 'react';
// import { useLocation } from 'react-router-dom';
// import { useAuth } from '@/features/auth';

// const AuthLogger: React.FC = () => {
//   const { authData } = useAuth();
//   const location = useLocation();

//   // remember which navigation we’ve already logged (handles StrictMode double-invoke too)
//   const loggedKeysRef = useRef<Set<string>>(new Set());

//   useEffect(() => {
//     const key =
//       location.key || `${location.pathname}${location.search}${location.hash}`;

//     if (loggedKeysRef.current.has(key)) return;
//     loggedKeysRef.current.add(key);

//     // ✨ exactly ONE log per navigation/reload
//     console.log('[Auth@nav]', {
//       path: location.pathname,
//       search: location.search,
//       hash: location.hash,
//       authData,
//     });

//     // optional: expose for quick inspection in DevTools
//     (window as any).__AUTH__ = authData;
//   }, [location.key, location.pathname, location.search, location.hash, authData]);

//   return null;
// };

// export default AuthLogger;
