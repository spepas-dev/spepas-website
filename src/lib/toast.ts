// src/lib/toast.ts
import { toast } from 'react-hot-toast';

export const toastConfig = {
  success: (message: string) =>
    toast.success(message, {
      duration: 3000,
      position: 'bottom-center'
    }),
  error: (message: string) =>
    toast.error(message, {
      duration: 5000,
      position: 'bottom-center'
    }),
  info: (message: string) =>
    toast(message, {
      duration: 3000,
      position: 'bottom-center'
    })
};
