import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { ProtectedRoute, AdminRoute } from "./components/RouteGuards";

import Home from "./pages/Home";
import Demostracion from "./pages/Demostracion";
import Search from "./pages/Search";
import PublishReport from "./pages/PublishReport";
import CaseDetail from "./pages/CaseDetail";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReports from "./pages/admin/AdminReports";
import AdminUsers from "./pages/admin/AdminUsers";

export default function App() {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="reportes" element={<AdminReports />} />
        <Route path="usuarios" element={<AdminUsers />} />
      </Route>

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/demostracion" element={<Demostracion />} />
        {/* Alias para el link ya compartido con tilde ("demostración"), codificado o no */}
        <Route path="/demostración" element={<Navigate to="/demostracion" replace />} />
        <Route path="/demostraci%C3%B3n" element={<Navigate to="/demostracion" replace />} />
        <Route path="/buscar" element={<Search />} />
        <Route path="/casos/:id" element={<CaseDetail />} />
        <Route path="/acceso" element={<Auth />} />

        <Route
          path="/publicar"
          element={
            <ProtectedRoute>
              <PublishReport />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
