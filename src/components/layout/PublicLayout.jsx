import { BookOpenText, LayoutDashboard, LogOut, PenSquare } from "lucide-react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import useAuth from "../../hooks/useAuth";

const navLinkClass = ({ isActive }) =>
  `rounded-full px-4 py-2 text-sm font-medium transition ${
    isActive ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-blue-50 hover:text-blue-700"
  }`;

const PublicLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen text-slate-900">
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
              <BookOpenText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-600">
                Blog Management
              </p>
              <p className="text-sm text-slate-500">Modern publishing made simple</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/" className={navLinkClass}>
              Blogs
            </NavLink>
            <NavLink to="/auth" className={navLinkClass}>
              Login
            </NavLink>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="hidden rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-sm text-slate-600 sm:block">
                  <span className="font-semibold text-slate-900">{user?.name}</span>
                  <span className="ml-2 capitalize text-blue-700">{user?.role}</span>
                </div>
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <PenSquare className="h-4 w-4" />
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-white/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-slate-500 sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
          <p>Built with React, Tailwind CSS, and your Express API.</p>
          <p>Authors publish stories. Admins manage the platform.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
