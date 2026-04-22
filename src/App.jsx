import { Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/common/ProtectedRoute";
import withAuth from "./components/common/withAuth";
import DashboardLayout from "./components/layout/DashboardLayout";
import PublicLayout from "./components/layout/PublicLayout";
import AuthPage from "./pages/AuthPage";
import BlogDetailsPage from "./pages/BlogDetailsPage";
import DashboardPage from "./pages/DashboardPage";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import PostEditorPage from "./pages/PostEditorPage";

const GuardedDashboardPage = withAuth(DashboardPage, {
  roles: ["admin", "author"],
});
const GuardedPostEditorPage = withAuth(PostEditorPage, {
  roles: ["admin", "author"],
});

const App = () => (
  <Routes>
    <Route element={<PublicLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/posts/:id" element={<BlogDetailsPage />} />
    </Route>

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute roles={["admin", "author"]}>
          <DashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<GuardedDashboardPage />} />
      <Route path="posts/new" element={<GuardedPostEditorPage />} />
      <Route path="posts/:id/edit" element={<GuardedPostEditorPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Route>

    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default App;
