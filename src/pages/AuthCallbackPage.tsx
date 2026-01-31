import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const AuthCallbackPage = () => {
    const navigate = useNavigate();
    const { setUser, setSessionToken } = useAuth() as any;
    const { toast } = useToast();

    useEffect(() => {
        const handleCallback = async () => {
            // Get the code from URL query parameters
            const params = new URLSearchParams(window.location.search);
            const code = params.get('code');

            if (!code) {
                toast({
                    title: 'Authentication Failed',
                    description: 'No authorization code received from Google.',
                    variant: 'destructive',
                });
                navigate('/auth');
                return;
            }

            try {
                // Exchange code for tokens via backend
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/auth/google/callback`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ code }),
                });

                if (!response.ok) {
                    throw new Error('Failed to exchange code for session');
                }

                const data = await response.json();

                // Map the user data
                const mappedUser = {
                    id: data.user.id,
                    email: data.user.email || null,
                    phone: data.user.phone || null,
                    name: data.user.name || data.user.user_metadata?.name || data.user.email || 'User',
                    role: data.user.role || data.user.user_metadata?.role || 'customer',
                    avatar: data.user.user_metadata?.avatar_url || data.user.avatar_url || null,
                    favorites: data.user.favorites || [],
                    createdAt: data.user.created_at,
                    address: data.user.address || null,
                };

                // Save to localStorage
                localStorage.setItem('kelsmall_token', data.access_token);
                localStorage.setItem('kelsmall_user', JSON.stringify(mappedUser));

                toast({
                    title: 'Welcome!',
                    description: 'You have successfully signed in with Google.',
                });

                // Redirect based on role
                if (['admin', 'super_admin', 'vendor_admin'].includes(mappedUser.role)) {
                    navigate('/admin');
                } else {
                    navigate('/account');
                }

                // Force reload to ensure AuthContext picks up the changes
                window.location.reload();
            } catch (error: any) {
                console.error('OAuth callback error:', error);
                toast({
                    title: 'Authentication Failed',
                    description: error.message || 'Could not complete Google sign-in.',
                    variant: 'destructive',
                });
                navigate('/auth');
            }
        };

        handleCallback();
    }, [navigate, toast]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <h2 className="text-xl font-semibold">Completing sign-in...</h2>
                <p className="text-muted-foreground mt-2">Please wait while we authenticate you with Google.</p>
            </div>
        </div>
    );
};

export default AuthCallbackPage;
