import { Link } from "react-router-dom";

const NotFoundPage = () => (
  <div className="flex min-h-screen items-center justify-center px-4">
    <div className="max-w-lg rounded-[32px] border border-white/70 bg-white p-10 text-center shadow-2xl shadow-blue-100/50">
      <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600">404</p>
      <h1 className="mt-4 text-4xl font-semibold text-slate-900">Page not found</h1>
      <p className="mt-4 text-sm leading-6 text-slate-600">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        Return home
      </Link>
    </div>
  </div>
);

export default NotFoundPage;
