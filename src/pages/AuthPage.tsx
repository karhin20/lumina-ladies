import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Sign In / Sign Up | KelsMall" },
    { name: "description", content: "Sign in or create an account to shop at KelsMall." },
  ];
};

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(loginEmail, loginPassword);

    if (result.success && result.user) {
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      // Redirect based on role
      if (['admin', 'super_admin', 'vendor_admin'].includes(result.user.role)) {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    } else {
      toast({
        title: 'Login failed',
        description: result.error,
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupPassword !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure your passwords match.',
        variant: 'destructive',
      });
      return;
    }

    if (signupPassword.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    const result = await signup(signupEmail, signupPassword, signupName, signupPhone);

    if (result.success) {
      toast({
        title: 'Account created!',
        description: 'Welcome to LumiGh.',
      });
      navigate('/account');
    } else {
      toast({
        title: 'Signup failed',
        description: result.error,
        variant: 'destructive',
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sky-100 to-sky-200 items-center justify-center p-12">
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=600&q=80"
            alt="Shopping cart with products"
            className="max-w-md w-full object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-background">
        <div className="w-full max-w-md">
          {!isSignup ? (
            <>
              <h1 className="font-display text-3xl lg:text-4xl font-semibold text-foreground mb-2">
                Log in to LumiGh
              </h1>
              <p className="text-muted-foreground mb-8">
                Enter your details below
              </p>

              <div className="mb-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center gap-2 h-11"
                  onClick={async () => {
                    setGoogleLoading(true);
                    try {
                      const { url } = await api.getGoogleAuthUrl();
                      window.location.href = url;
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Could not initiate Google Login",
                        variant: "destructive",
                      });
                      setGoogleLoading(false);
                    }
                  }}
                  disabled={googleLoading}
                >
                  {googleLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                    </svg>
                  )}
                  Sign in with Google
                </Button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or log in with email</span>
                </div>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="border-0 border-b border-border rounded-none px-0 py-3 focus-visible:ring-0 focus-visible:border-foreground bg-transparent"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="border-0 border-b border-border rounded-none px-0 py-3 focus-visible:ring-0 focus-visible:border-foreground bg-transparent"
                    required
                  />
                </div>

                <div className="flex items-center justify-between gap-4 pt-2">
                  <Button
                    type="submit"
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-8"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Log In'}
                  </Button>
                  <button
                    type="button"
                    className="text-destructive hover:underline text-sm"
                  >
                    Forget Password?
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-muted-foreground text-sm">
                  Don't have an account?{' '}
                  <button
                    onClick={() => setIsSignup(true)}
                    className="text-red-600 hover:underline font-extrabold text-lg"
                  >
                    Sign Up
                  </button>
                </p>
              </div>

            </>
          ) : (
            <>
              <h1 className="font-display text-3xl lg:text-4xl font-semibold text-foreground mb-2">
                Create an account
              </h1>
              <p className="text-muted-foreground mb-8">
                Enter your details below
              </p>

              <div className="mb-6">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center gap-2 h-11"
                  onClick={async () => {
                    setGoogleLoading(true);
                    try {
                      const { url } = await api.getGoogleAuthUrl();
                      window.location.href = url;
                    } catch (error) {
                      toast({
                        title: "Error",
                        description: "Could not initiate Google Login",
                        variant: "destructive",
                      });
                      setGoogleLoading(false);
                    }
                  }}
                  disabled={googleLoading}
                >
                  {googleLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                    </svg>
                  )}
                  Sign up with Google
                </Button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or sign up with email</span>
                </div>
              </div>

              <form onSubmit={handleSignup} className="space-y-6">
                <div>
                  <Input
                    type="text"
                    placeholder="Name"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="border-0 border-b border-border rounded-none px-0 py-3 focus-visible:ring-0 focus-visible:border-foreground bg-transparent"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="border-0 border-b border-border rounded-none px-0 py-3 focus-visible:ring-0 focus-visible:border-foreground bg-transparent"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="border-0 border-b border-border rounded-none px-0 py-3 focus-visible:ring-0 focus-visible:border-foreground bg-transparent"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border-0 border-b border-border rounded-none px-0 py-3 focus-visible:ring-0 focus-visible:border-foreground bg-transparent"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    className="border-0 border-b border-border rounded-none px-0 py-3 focus-visible:ring-0 focus-visible:border-foreground bg-transparent"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-muted-foreground text-sm">
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsSignup(false)}
                    className="text-red-600 hover:underline font-extrabold text-lg"
                  >
                    Log in
                  </button>
                </p>
              </div>
            </>
          )}

          <div className="mt-8">
            <Link
              to="/"
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              ← Back to Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

