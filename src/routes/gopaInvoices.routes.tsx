// src/routes/gopaInvoices.routes.tsx
import { RouteObject } from 'react-router-dom';
import AcceptInvoicePage from '@/pages/gopaInvoices/AcceptInvoicePage';
import InvoiceListToAcceptPage from '@/pages/gopaInvoices/InvoiceListToAcceptPage';
import GopaAcceptedInvoicesPage from '@/pages/gopaInvoices/GopaAcceptedInvoicesPage';
import GopaAcceptedInvoiceDetailsPage from '@/pages/gopaInvoices/GopaAcceptedInvoiceDetailsPage';
import GopaAcceptedInvoiceItemDetailsPage from '@/pages/gopaInvoices/GopaAcceptedInvoiceItemDetailsPage';

export const gopaInvoiceRoutes: RouteObject[] = [
  { path: 'gopa-invoices/accept', element: <AcceptInvoicePage /> },
  { path: 'gopa-invoices/to-accept', element: <InvoiceListToAcceptPage /> },
  { path: 'gopa-invoices/accepted', element: <GopaAcceptedInvoicesPage /> },
  {
    path: 'gopa-invoices/accepted/:invoice_id',
    element: <GopaAcceptedInvoiceDetailsPage />,
  },
  {
    path: 'gopa-invoices/accepted/:invoice_id/items/:item_id',
    element: <GopaAcceptedInvoiceItemDetailsPage />,
  },
];
