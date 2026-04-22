import { LoaderCircle, LockKeyhole, Mail, UserRound } from "lucide-react";

const inputClassName =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:bg-white";

const AuthForm = ({
  mode,
  formData,
  error,
  loading,
  onChange,
  onModeChange,
  onSubmit,
}) => {
  const isRegister = mode === "register";

  return (
    <div className="rounded-[32px] border border-white/70 bg-white p-8 shadow-2xl shadow-blue-100/50">
      <div className="flex rounded-full bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => onModeChange("login")}
          className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition ${
            !isRegister ? "bg-blue-600 text-white" : "text-slate-600 hover:text-blue-700"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => onModeChange("register")}
          className={`flex-1 rounded-full px-4 py-3 text-sm font-semibold transition ${
            isRegister ? "bg-blue-600 text-white" : "text-slate-600 hover:text-blue-700"
          }`}
        >
          Register
        </button>
      </div>

      <div className="mt-8">
        <h1 className="text-3xl font-semibold text-slate-900">
          {isRegister ? "Create your author account" : "Welcome back"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {isRegister
            ? "Self-registration creates an author account. Admin users should be inserted manually from the database."
            : "Use the same login screen for authors and admins. Your role controls the dashboard you see."}
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-8 space-y-5">
        {isRegister ? (
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
              <UserRound className="h-4 w-4 text-blue-600" />
              Full name
            </span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="John Doe"
              className={inputClassName}
            />
          </label>
        ) : null}

        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <Mail className="h-4 w-4 text-blue-600" />
            Email
          </span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            placeholder="john@example.com"
            className={inputClassName}
          />
        </label>

        <label className="block">
          <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
            <LockKeyhole className="h-4 w-4 text-blue-600" />
            Password
          </span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            placeholder="Enter a secure password"
            className={inputClassName}
          />
        </label>

        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
          {loading ? "Please wait..." : isRegister ? "Create account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
