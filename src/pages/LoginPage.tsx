import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, GraduationCap, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import kfuLogo from "@/assets/kfu-logo.png";
import { useEffect } from "react";
import { isKfuEmail, normalizeEmail } from "@/lib/validations";

const LoginPage = () => {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) navigate("/");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);

    const normalizedEmail = normalizeEmail(email);

    if (isSignUp) {
      if (!isKfuEmail(normalizedEmail)) {
        setError("Use an official KFU email ending with @student.kfu.edu.sa or @kfu.edu.sa.");
        setSubmitting(false);
        return;
      }
      const { error } = await signUp(normalizedEmail, password);
      if (error) setError(error);
      else setSuccess("Check your KFU email to confirm your account before signing in.");
    } else {
      const { error } = await signIn(normalizedEmail, password);
      if (error) setError(error);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Link to="/" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />Back to Home
          </Link>

          <div className="border-2 border-border p-8 bg-card">
            <div className="text-center mb-8">
              <img src={kfuLogo} alt="KFU Logo" className="h-16 mx-auto mb-4" />
              <h1 className="text-3xl font-bold mb-2">{isSignUp ? "Create Account" : "Student Sign In"}</h1>
              <p className="text-muted-foreground">
                {isSignUp ? "Sign up to start sharing resources." : "Sign in to upload and share resources."}
              </p>
            </div>

            <Alert className="mb-6 border-2 border-primary/30 bg-primary/5">
              <GraduationCap className="h-4 w-4" />
              <AlertDescription>
                <strong>KFU Community:</strong> Accounts use official KFU email domains for safer sharing across all majors.
              </AlertDescription>
            </Alert>

            {error && (
              <Alert className="mb-4 border-2 border-destructive/30 bg-destructive/5">
                <AlertDescription className="text-destructive">{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="mb-4 border-2 border-chart-2/30 bg-chart-2/5">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student123@student.kfu.edu.sa or name@kfu.edu.sa"
                    className="border-2 pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="border-2 pl-10 pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" size="lg" className="w-full border-2 h-14 text-base" disabled={submitting}>
                {submitting ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setError(null); setSuccess(null); }}
                className="text-sm text-muted-foreground hover:text-foreground underline"
              >
                {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
              </button>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-border">
              <p className="text-xs text-muted-foreground text-center">
                By signing in, you agree to our Terms of Service. Only upload student-made resources — no leaked exams or copyrighted materials.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              🎓 <strong>By Students, For Students</strong> — This platform is community-driven across KFU majors.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
