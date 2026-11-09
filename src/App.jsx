import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Catalog from './pages/Catalog.jsx';
import ComponentDetail from './pages/ComponentDetail.jsx';
import Manufacturers from './pages/Manufacturers.jsx';
import ManufacturerDetail from './pages/ManufacturerDetail.jsx';
import Categories from './pages/Categories.jsx';
import CategoryDetail from './pages/CategoryDetail.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/components" element={<Catalog />} />
        <Route path="/components/:id" element={<ComponentDetail />} />
        <Route path="/manufacturers" element={<Manufacturers />} />
        <Route path="/manufacturers/:id" element={<ManufacturerDetail />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:id" element={<CategoryDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
