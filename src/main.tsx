//src/main.tsx
import "./index.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from 'react-hot-toast'

// local imports
import { queryClient } from "@/lib";
import App from "./App.tsx";
import { AuthProvider } from "@/features/auth"; 

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
      <Toaster />
        <App />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
