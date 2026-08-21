import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { I18nProvider } from './i18n/I18nContext';
import { AuthProvider } from './admin/auth/AuthContext';
import { CartProvider } from './cart/CartContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
    </I18nProvider>
  </React.StrictMode>
);
