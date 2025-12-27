/**
 * Utility for lazy loading components with Suspense
 */
import { lazy } from 'react';

// Lazy load all pages
export const Home = lazy(() => import('../pages/Home'));
export const Login = lazy(() => import('../pages/Login'));
export const Register = lazy(() => import('../pages/Register'));
export const Menu = lazy(() => import('../pages/Menu'));
export const Cart = lazy(() => import('../pages/Cart'));
export const Checkout = lazy(() => import('../pages/Checkout'));
export const OrderTracking = lazy(() => import('../pages/OrderTracking'));
export const Reservations = lazy(() => import('../pages/Reservations'));
export const MenuItemDetail = lazy(() => import('../pages/MenuItemDetail'));
export const Deals = lazy(() => import('../pages/Deals'));
export const ComboDetail = lazy(() => import('../pages/ComboDetail'));
export const Reviews = lazy(() => import('../pages/Reviews'));

// Admin pages - lazy loaded separately
export const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
export const AdminMenu = lazy(() => import('../pages/AdminMenu'));
export const AdminOrders = lazy(() => import('../pages/AdminOrders'));
export const AdminUsers = lazy(() => import('../pages/AdminUsers'));
export const AdminReservations = lazy(() => import('../pages/AdminReservations'));
export const AdminCategories = lazy(() => import('../pages/AdminCategories'));

