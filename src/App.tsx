import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { appRoutes } from './routes';
import { CartProvider } from './store/CartContext';

export default function App() {
  return (
    <CartProvider><BrowserRouter>
      <Routes>{appRoutes.map((r) => <Route key={r.path} path={r.path} element={r.element} />)}</Routes>
    </BrowserRouter></CartProvider>
  );
}
