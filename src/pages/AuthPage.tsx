import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const AuthPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Login form state
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(loginPhone, loginPassword);

    if (result.success) {
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      navigate('/account');
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

    const result = await signup(signupPhone, signupPassword, signupName);

    if (result.success) {
      toast({
        title: 'Account created!',
        description: 'Welcome to Luxe Artisan.',
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
                Log in to Exclusive
              </h1>
              <p className="text-muted-foreground mb-8">
                Enter your details below
              </p>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <Input
                    type="tel"
                    placeholder="Email or Phone Number"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
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
                    className="text-foreground hover:underline font-medium"
                  >
                    Sign Up
                  </button>
                </p>
              </div>

              {/* Demo credentials */}
              <div className="mt-8 p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Demo Mode:</span> Admin: 0201234567 / admin123
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
                    type="tel"
                    placeholder="Email or Phone Number"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
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
                    className="text-foreground hover:underline font-medium"
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
