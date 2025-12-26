import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse text-muted-foreground">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    // Allow admin, super_admin, and vendor_admin to access admin routes
    if (!["admin", "super_admin", "vendor_admin"].includes(user.role)) {
        return <Navigate to="/account" replace />;
    }

    return <>{children}</>;
};

export default AdminRoute;
