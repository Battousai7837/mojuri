import Page_index from './pages/Page_index';
import Page_index2 from './pages/Page_index2';
import Page_index3 from './pages/Page_index3';
import Page_index4 from './pages/Page_index4';
import Page_index5 from './pages/Page_index5';
import Page_index6 from './pages/Page_index6';
import Page_index7 from './pages/Page_index7';
import Page_index8 from './pages/Page_index8';
import Page_page_404 from './pages/Page_page_404';
import Page_page_about from './pages/Page_page_about';
import Page_page_contact from './pages/Page_page_contact';
import Page_page_faq from './pages/Page_page_faq';
import Page_page_forgot_password from './pages/Page_page_forgot_password';
import Page_shop_details from './pages/Page_shop_details';
import Page_shop_wishlist from './pages/Page_shop_wishlist';
import AdminDashboard from './pages/AdminDashboard';
import StoreShop from './pages/StoreShop';
import StoreProductDetail from './pages/StoreProductDetail';
import StoreCart from './pages/StoreCart';
import StoreCheckout from './pages/StoreCheckout';
import OrderTracking from './pages/OrderTracking';
import StoreBlog from './pages/StoreBlog';
import StoreBlogDetail from './pages/StoreBlogDetail';
import StoreAuth from './pages/StoreAuth';

export const appRoutes = [
  { path: '/admin', element: <AdminDashboard /> },
  { path: '/shop-details/:slug', element: <StoreProductDetail /> },
  { path: '/blog/:slug', element: <StoreBlogDetail /> },
  { path: '/order-tracking', element: <OrderTracking /> },
  { path: '/blog-details-fullwidth', element: <StoreBlogDetail /> },
  { path: '/blog-details-left', element: <StoreBlogDetail /> },
  { path: '/blog-details-right', element: <StoreBlogDetail /> },
  { path: '/blog-grid-fullwidth', element: <StoreBlog /> },
  { path: '/blog-grid-left', element: <StoreBlog /> },
  { path: '/blog-grid-right', element: <StoreBlog /> },
  { path: '/blog-list-left', element: <StoreBlog /> },
  { path: '/blog-list-right', element: <StoreBlog /> },
  { path: '/', element: <Page_index /> },
  { path: '/index2', element: <Page_index2 /> },
  { path: '/index3', element: <Page_index3 /> },
  { path: '/index4', element: <Page_index4 /> },
  { path: '/index5', element: <Page_index5 /> },
  { path: '/index6', element: <Page_index6 /> },
  { path: '/index7', element: <Page_index7 /> },
  { path: '/index8', element: <Page_index8 /> },
  { path: '/page-404', element: <Page_page_404 /> },
  { path: '/page-about', element: <Page_page_about /> },
  { path: '/page-contact', element: <Page_page_contact /> },
  { path: '/page-faq', element: <Page_page_faq /> },
  { path: '/page-forgot-password', element: <Page_page_forgot_password /> },
  { path: '/page-login', element: <StoreAuth /> },
  { path: '/page-my-account', element: <StoreAuth /> },
  { path: '/shop-cart', element: <StoreCart /> },
  { path: '/shop-checkout', element: <StoreCheckout /> },
  { path: '/shop-details', element: <Page_shop_details /> },
  { path: '/shop-grid-fullwidth', element: <StoreShop /> },
  { path: '/shop-grid-left', element: <StoreShop /> },
  { path: '/shop-grid-right', element: <StoreShop /> },
  { path: '/shop-list-left', element: <StoreShop /> },
  { path: '/shop-list-right', element: <StoreShop /> },
  { path: '/shop-wishlist', element: <Page_shop_wishlist /> },
];
