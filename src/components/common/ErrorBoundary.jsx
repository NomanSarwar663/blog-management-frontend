import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    console.error("UI rendering error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center px-6">
          <div className="max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-lg shadow-red-100/40">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-red-500">
              Something broke
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-slate-900">
              We hit an unexpected error.
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Refresh the page to try again. If the issue continues, check the browser
              console and API server.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
