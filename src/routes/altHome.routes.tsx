// src/routes/altHome.routes.tsx
import { RouteObject } from 'react-router-dom';

import AltHomeLayout from '@/components/layout/alt-home/AltHomeLayout';
import AltHomePage from '@/pages/marketing/home/alt-home/page';

export const altHomeRoutes: RouteObject[] = [
  {
    element: <AltHomeLayout />,
    children: [{ index: true, element: <AltHomePage /> }]
  }
];
