const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-blue-100 bg-white px-5 py-4 shadow-sm">
      <p className="text-sm text-slate-500">
        Page <span className="font-semibold text-slate-900">{pagination.currentPage}</span> of{" "}
        <span className="font-semibold text-slate-900">{pagination.totalPages}</span>
      </p>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onPageChange(pagination.currentPage - 1)}
          disabled={!pagination.hasPrev}
          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => onPageChange(pagination.currentPage + 1)}
          disabled={!pagination.hasNext}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
