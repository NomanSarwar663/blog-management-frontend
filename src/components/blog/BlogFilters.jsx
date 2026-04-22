import { Search } from "lucide-react";

const BlogFilters = ({
  search,
  status,
  onSearchChange,
  onStatusChange,
  onSubmit,
  showStatus = false,
  submitLabel = "Search",
}) => (
  <form
    onSubmit={onSubmit}
    className="rounded-[28px] border border-white/70 bg-white p-4 shadow-lg shadow-blue-100/30"
  >
    <div className="grid gap-4 md:grid-cols-[1fr_auto_auto]">
      <label className="relative block">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search blogs by title or tag..."
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white"
        />
      </label>

      {showStatus ? (
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white"
        >
          <option value="">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      ) : (
        <div className="hidden md:block" />
      )}

      <button
        type="submit"
        className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        {submitLabel}
      </button>
    </div>
  </form>
);

export default BlogFilters;
