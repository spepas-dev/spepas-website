//src/routes/rider.routes.tsx
import { RouteObject } from 'react-router-dom';

// Pages
import RiderOrdersPage from '@/pages/rider/orders';
import RiderOrdersDeliveredPage from '@/pages/rider/orders-delivered';
import RiderOrderDetailPage from '@/pages/rider/order-detail';
import RiderPickupPage from '@/pages/rider/pickup';
import RiderDropoffPage from '@/pages/rider/dropoff';
import RiderScanPage from '@/pages/rider/scan';
import RiderProofPage from '@/pages/rider/proof';
import RiderProofSubmitPage from '@/pages/rider/proof-submit';
import RiderDeliveredSuccessPage from '@/pages/rider/delivered-success';
import RiderInvoicesPage from '@/pages/rider/invoices';

export const riderRoutes: RouteObject[] = [
  // Lists
  { path: 'orders', element: <RiderOrdersPage /> },
  { path: 'orders-delivered', element: <RiderOrdersDeliveredPage /> },

  // Invoices
  { path: 'invoices', element: <RiderInvoicesPage /> },

  // Details
  { path: 'orders/:orderId', element: <RiderOrderDetailPage /> },

  // Pickup / Dropoff map views
  { path: 'pickup/:orderId', element: <RiderPickupPage /> },
  { path: 'dropoff/:orderId', element: <RiderDropoffPage /> },

  // QR scanning (seller at pickup, buyer at dropoff)
  { path: 'orders/:orderId/scan/:type', element: <RiderScanPage /> }, // type = 'pickup' | 'dropoff'

  // Proof of delivery flow
  { path: 'orders/:orderId/proof', element: <RiderProofPage /> },
  { path: 'orders/:orderId/proof-submit', element: <RiderProofSubmitPage /> },
  { path: 'orders/:orderId/delivered-success', element: <RiderDeliveredSuccessPage /> },
];
