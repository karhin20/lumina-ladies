import { useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  LogOut, ArrowLeft, Settings, Menu, Store, User
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { useVendor } from '@/hooks/useVendor';

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { href: '/admin/customers', icon: Users, label: 'Customers', superAdminOnly: true },
  { href: '/admin/vendors', icon: Store, label: 'Vendors', superAdminOnly: true },
  { href: '/admin/vendor-profile', icon: Store, label: 'My Store', vendorAdminOnly: true },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

const AdminDashboard = () => {
  const { user, isLoading, logout } = useAuth();
  const { vendor } = useVendor();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || !["admin", "super_admin", "vendor_admin"].includes(user.role))) {
      navigate('/auth');
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h1 className="font-display text-xl font-semibold">Admin Panel</h1>
        <p className="text-sm text-muted-foreground truncate">
          {vendor?.name || (user?.role === 'super_admin' ? 'LumiGh Platform' : 'LumiGh Admin')}
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems
          .filter((item) => {
            // Filter out super admin only items for non-super admins
            if (item.superAdminOnly && user.role !== 'super_admin') return false;
            // Filter out vendor admin only items for non-vendor admins
            if (item.vendorAdminOnly && user.role !== 'vendor_admin') return false;
            return true;
          })
          .map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
      </nav>

      <div className="p-4 border-t border-border space-y-2">
        <Link
          to="/account"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <User className="w-5 h-5" />
          My Account
        </Link>
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Store
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 border-r border-border bg-card/50">
        <SidebarContent />
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md px-4 py-3 flex items-center justify-between">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <h1 className="font-display text-base font-semibold">Admin Panel</h1>
          <div className="w-9" />
        </header>

        {/* Main Content */}
        <main className="flex-1 p-3 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

