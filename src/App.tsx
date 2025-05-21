//src/App.tsx
import { RouterProvider } from 'react-router-dom';
// import { Toaster } from 'react-hot-toast'

// import { Toaster } from '@/components/ui/sonner'
import { router } from '@/routes';

function App() {
  return (
    <>
      {/* <Toaster /> */}

      <RouterProvider router={router} />
    </>
  )
}

export default App;
