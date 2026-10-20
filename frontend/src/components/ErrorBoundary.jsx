import React from "react";
import { Link } from "react-router-dom";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("PUST Alumni Network caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-2xl mx-auto mb-4 border border-red-100">
              ⚠️
            </div>
            <h1 className="font-display font-bold text-2xl text-slate-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              The PUST Alumni platform encountered an unexpected error while rendering this page.
              Our technical team has been notified.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <button
                type="button"
                onClick={this.handleReload}
                className="px-5 py-2.5 rounded-lg bg-[#006B3F] hover:bg-[#004D2C] text-white font-semibold text-sm transition-colors shadow-sm"
              >
                Reload Page
              </button>
              <Link
                to="/"
                onClick={() => this.setState({ hasError: false })}
                className="px-5 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-colors"
              >
                Return to Home
              </Link>
            </div>
            {this.state.error && (
              <details className="text-left bg-slate-50 rounded-lg p-3 text-xs text-slate-500 border border-slate-200 overflow-x-auto">
                <summary className="cursor-pointer font-medium text-slate-700 mb-1">
                  Technical Details
                </summary>
                <code className="text-red-700 font-mono text-[11px] block mt-1">
                  {this.state.error.toString()}
                </code>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
