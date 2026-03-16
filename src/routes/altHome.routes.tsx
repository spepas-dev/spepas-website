// src/routes/altHome.routes.tsx
import { RouteObject, Navigate } from 'react-router-dom'
import AltHomeLayout from '@/components/layout/alt-home/AltHomeLayout'
import AltHomePage   from '@/pages/marketing/home/alt-home/page'
import { useAuth }   from '@/features/auth'

function HomeOrShop() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/95668339501103956045/shop" replace />
  return <AltHomePage />
}

export const altHomeRoutes: RouteObject[] = [
  {
    element: <AltHomeLayout />,
    children: [
      { index: true, element: <HomeOrShop /> }
    ]
  }
]
