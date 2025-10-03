import { useState } from "react";
import { useAuth } from "../../../supabase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate, Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Sparkles } from "lucide-react";

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signUp(email, password, fullName);
      toast({
        title: "🎉 Account created!",
        description: "Welcome to Trip Expense Manager!",
        duration: 5000,
      });
      navigate("/dashboard");
    } catch (error) {
      setError("Error creating account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl animate-bounce">🌍</div>
        <div className="absolute top-40 right-20 text-5xl animate-pulse">🎉</div>
        <div className="absolute bottom-32 left-20 text-5xl animate-bounce delay-100">🎨</div>
        <div className="absolute bottom-20 right-32 text-6xl animate-pulse delay-200">🚀</div>
        <div className="absolute top-1/2 left-1/4 text-4xl animate-bounce delay-300">⭐</div>
        <div className="absolute top-1/3 right-1/3 text-5xl animate-pulse delay-150">🎪</div>
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
            Start your journey today
            <Sparkles className="h-4 w-4" />
          </p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border-4 border-white">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">✨ Create Account</h2>
            <p className="text-gray-600 text-sm">Join thousands of happy travelers</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl">
                  👤
                </div>
                <Input
                  type="text"
                  placeholder="Your name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="pl-14 h-14 rounded-2xl border-2 border-gray-200 focus:border-green-400 text-base"
                />
              </div>
            </div>

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
                  className="pl-14 h-14 rounded-2xl border-2 border-gray-200 focus:border-green-400 text-base"
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
                  placeholder="Create password (min 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="pl-14 h-14 rounded-2xl border-2 border-gray-200 focus:border-green-400 text-base"
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
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 hover:from-green-600 hover:via-blue-600 hover:to-purple-600 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin">⏳</div>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  🎉 Create Account
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

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-gray-600 mb-3">
              👋 Already have an account?
            </p>
            <Link to="/login">
              <Button
                variant="outline"
                className="w-full h-12 rounded-2xl border-2 border-gray-300 hover:border-green-400 hover:bg-green-50 text-base font-semibold"
              >
                🚀 Sign In
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