const LoadingSpinner = ({ label = "Loading..." }) => (
  <div className="flex items-center justify-center gap-3 py-8 text-sm font-medium text-slate-500">
    <span className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />
    <span>{label}</span>
  </div>
);

export default LoadingSpinner;
