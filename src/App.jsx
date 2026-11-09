import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Catalog from './pages/Catalog.jsx';
import ComponentDetail from './pages/ComponentDetail.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/components" element={<Catalog />} />
        <Route path="/components/:id" element={<ComponentDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
