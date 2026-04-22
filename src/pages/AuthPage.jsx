import { ShieldCheck, Sparkles, UserCircle2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import AuthForm from "../components/auth/AuthForm";
import useApi from "../hooks/useApi";
import useAuth from "../hooks/useAuth";

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/dashboard";
  const { isAuthenticated, login, register } = useAuth();
  const { loading, error, request, resetError } = useApi();
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    resetError();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (mode === "register") {
        await request(() => register(formData), "Unable to create your account.");
      } else {
        await request(
          () => login({ email: formData.email, password: formData.password }),
          "Unable to log you in."
        );
      }

      navigate(redirectTo, { replace: true });
    } catch (submitError) {
      // Inline feedback is rendered in the form.
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[32px] border border-white/70 bg-gradient-to-br from-blue-600 to-sky-500 p-8 text-white shadow-2xl shadow-blue-200/60 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-100">
            Unified Access
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight">
            One login screen for admins and authors.
          </h2>
          <p className="mt-5 max-w-lg text-sm leading-7 text-blue-50">
            Authors can self-register, publish blog posts, and manage their content.
            Admins use the same login form and gain broader visibility across the platform.
          </p>

          <div className="mt-10 space-y-4">
            {[
              {
                icon: UserCircle2,
                title: "Author flow",
                description: "Create drafts, publish content, and keep your writing organized.",
              },
              {
                icon: ShieldCheck,
                title: "Admin flow",
                description: "Manage all posts and monitor high-level publishing stats.",
              },
              {
                icon: Sparkles,
                title: "Smooth experience",
                description: "Tokens refresh automatically while you keep working.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl bg-white/10 p-5 backdrop-blur">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="mt-1 text-sm leading-6 text-blue-50">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <AuthForm
          mode={mode}
          formData={formData}
          error={error}
          loading={loading}
          onChange={handleChange}
          onModeChange={handleModeChange}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default AuthPage;
