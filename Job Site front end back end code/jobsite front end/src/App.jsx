// Main App component
import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { Toaster } from 'react-hot-toast';
import routes from './routes/AppRoutes';

import './styles/globals.css';
import './styles/theme.css';
import './styles/animations.css';

function App() {
  const router = createBrowserRouter(routes, {
    future: { v7_startTransition: true, v7_relativeSplatPath: true }
  });

  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <RouterProvider router={router} future={{ v7_startTransition: true, v7_relativeSplatPath: true }} />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#363636',
                borderRadius: '10px',
                border: '1px solid #e5e7eb'
              },
            }}
          />
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
