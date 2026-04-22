import { Home, LayoutDashboard, LogOut, PlusCircle, ShieldCheck } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
        : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
    }`;

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:px-8">
      <aside className="w-full rounded-[28px] border border-white/60 bg-white/85 p-6 shadow-xl shadow-blue-100/40 backdrop-blur lg:sticky lg:top-6 lg:w-80 lg:self-start">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
            {user?.role === "admin" ? <ShieldCheck className="h-5 w-5" /> : <LayoutDashboard className="h-5 w-5" />}
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-900">{user?.name}</p>
            <p className="capitalize text-slate-500">{user?.role} dashboard</p>
          </div>
        </Link>

        <nav className="mt-8 space-y-2">
          <NavLink to="/dashboard" end className={linkClass}>
            <LayoutDashboard className="h-4 w-4" />
            Overview
          </NavLink>
          <NavLink to="/dashboard/posts/new" className={linkClass}>
            <PlusCircle className="h-4 w-4" />
            Create Post
          </NavLink>
          <Link
            to="/"
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
          >
            <Home className="h-4 w-4" />
            Public Blog
          </Link>
        </nav>

        <div className="mt-8 rounded-3xl bg-blue-50 p-5 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">Role permissions</p>
          <p className="mt-2 leading-6">
            {user?.role === "admin"
              ? "You can manage all posts and access aggregated platform stats."
              : "You can create, edit, publish, and delete only your own posts."}
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>

      <section className="min-w-0 flex-1 rounded-[28px] border border-white/60 bg-white/85 p-5 shadow-xl shadow-blue-100/40 backdrop-blur sm:p-8">
        <Outlet />
      </section>
    </div>
  );
};

export default DashboardLayout;
