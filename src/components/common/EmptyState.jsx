import { Link } from "react-router-dom";

const EmptyState = ({ title, description, actionLabel, actionTo }) => (
  <div className="rounded-3xl border border-dashed border-blue-200 bg-white/80 p-10 text-center shadow-sm">
    <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
    <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
    {actionLabel && actionTo ? (
      <Link
        to={actionTo}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        {actionLabel}
      </Link>
    ) : null}
  </div>
);

export default EmptyState;
