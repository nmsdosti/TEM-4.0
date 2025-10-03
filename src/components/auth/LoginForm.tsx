import { useState } from "react";
import { useAuth } from "../../../supabase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn, Sparkles } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signIn(email, password);
      navigate("/dashboard");
    } catch (error) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl animate-bounce">✈️</div>
        <div className="absolute top-40 right-20 text-5xl animate-pulse">🏖️</div>
        <div className="absolute bottom-32 left-20 text-5xl animate-bounce delay-100">🎒</div>
        <div className="absolute bottom-20 right-32 text-6xl animate-pulse delay-200">🗺️</div>
        <div className="absolute top-1/2 left-1/4 text-4xl animate-bounce delay-300">💰</div>
        <div className="absolute top-1/3 right-1/3 text-5xl animate-pulse delay-150">🎫</div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white rounded-3xl p-4 shadow-lg mb-4">
            <div className="text-5xl">💼</div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Trip Expense Manager
          </h1>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            Track your adventures
            <Sparkles className="h-4 w-4" />
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-4 border-white">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">👋 Welcome Back!</h2>
            <p className="text-gray-600 text-sm">Sign in to continue your journey</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">
                  📧
                </div>
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-14 h-14 rounded-2xl border-2 border-gray-200 focus:border-blue-400 text-base"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">
                  🔒
                </div>
                <Input
                  type="password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-14 h-14 rounded-2xl border-2 border-gray-200 focus:border-blue-400 text-base"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-3 text-center">
                <p className="text-red-600 text-sm">❌ {error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin">⏳</div>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  🚀 Sign In
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t-2 border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">✨ or ✨</span>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-600 mb-3">
              🆕 New to Trip Expense Manager?
            </p>
            <Link to="/signup">
              <Button
                variant="outline"
                className="w-full h-12 rounded-2xl border-2 border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-base font-semibold"
              >
                ✨ Create Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>🔒 Your data is safe and secure</p>
        </div>
      </div>
    </div>
  );
}