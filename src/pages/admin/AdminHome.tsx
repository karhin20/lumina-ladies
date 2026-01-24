import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAdminStats } from '@/hooks/useAdminStats';
import { useAuth } from '@/contexts/AuthContext';
import { api, ApiVendorStat } from '@/lib/api';
import { AnalyticsChart, OrdersChart } from '@/components/admin/AnalyticsChart';
import { cn } from '@/lib/utils';

const AdminHome = () => {
  const { user, sessionToken } = useAuth();
  const queryClient = useQueryClient();
  const { data: stats, isLoading } = useAdminStats();

  useEffect(() => {
    if (sessionToken) {
      // Prefetch customers and orders to make tab switching instant
      queryClient.prefetchQuery({
        queryKey: ["admin-customers", sessionToken],
        queryFn: () => api.adminCustomers(sessionToken),
      });
      queryClient.prefetchQuery({
        queryKey: ["admin-orders", sessionToken],
        queryFn: () => api.adminOrders(sessionToken),
      });
    }
  }, [sessionToken, queryClient]);

  const isSuperAdmin = user?.role === 'super_admin';

  // Ensure stats is defined and has default values if API returns partial data
  const safeStats = {
    totalRevenue: stats?.total_revenue ?? 0,
    totalOrders: stats?.total_orders ?? 0,
    totalCustomers: stats?.total_customers ?? 0,
    totalProducts: stats?.total_products ?? 0,
    recentOrders: stats?.recent_orders ?? [],
    vendorStats: stats?.vendor_stats ?? [],
    topProducts: stats?.top_products ?? [],
    dailyStats: stats?.daily_stats ?? [],
    revenueChange: stats?.revenue_change ?? 0,
    ordersChange: stats?.orders_change ?? 0,
    customersChange: stats?.customers_change ?? 0,
    productsChange: stats?.products_change ?? 0,
  };

  const formatChange = (val: number) => {
    const prefix = val > 0 ? '+' : '';
    return `${prefix}${val.toFixed(1)}%`;
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₵${(safeStats.totalRevenue || 0).toLocaleString()}`,
      change: formatChange(safeStats.revenueChange),
      isNegative: safeStats.revenueChange < 0,
      icon: DollarSign,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Total Orders',
      value: (safeStats.totalOrders || 0).toString(),
      change: formatChange(safeStats.ordersChange),
      isNegative: safeStats.ordersChange < 0,
      icon: ShoppingCart,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Customers',
      value: (safeStats.totalCustomers || 0).toString(),
      change: formatChange(safeStats.customersChange),
      isNegative: safeStats.customersChange < 0,
      icon: Users,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      title: 'Products',
      value: (safeStats.totalProducts || 0).toString(),
      change: formatChange(safeStats.productsChange),
      isNegative: safeStats.productsChange < 0,
      icon: Package,
      color: 'text-orange-600 bg-orange-100',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">
          {user?.role === 'vendor_admin'
            ? "Track your store's performance and manage your inventory."
            : "Welcome back! Here's what's happening across the platform."}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between gap-2">
                <div className={`p-1.5 sm:p-2 rounded-lg ${stat.color} flex-shrink-0`}>
                  <stat.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className={cn(
                  "flex items-center text-[10px] sm:text-xs font-bold whitespace-nowrap",
                  stat.isNegative ? "text-red-600" : "text-green-600"
                )}>
                  {stat.change}
                  {stat.isNegative ? (
                    <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5 rotate-90" />
                  ) : (
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5" />
                  )}
                </span>
              </div>
              <div className="mt-3 sm:mt-4">
                <p className="text-lg sm:text-2xl font-bold truncate">{stat.value}</p>
                <p className="text-[10px] sm:text-sm text-muted-foreground uppercase tracking-wider font-medium">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AnalyticsChart
          data={safeStats.dailyStats}
          title="Revenue Growth"
          description="Daily revenue over the last 30 days"
        />
        <OrdersChart
          data={safeStats.dailyStats}
          title="Order Trends"
          description="Daily order volume"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest orders from customers</CardDescription>
            </div>
            <Link to="/admin/orders" className="text-sm text-primary hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {safeStats.recentOrders.slice(0, 5).map((order: any) => (
                <div key={order.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div>
                    <p className="font-medium">#{order.id?.slice(0, 8).toUpperCase()}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at || order.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    <span className="font-semibold">₵{order.total?.toFixed(2) || order.total}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Best selling items this month</CardDescription>
            </div>
            <Link to="/admin/products" className="text-sm text-primary hover:underline flex items-center gap-1">
              View All <ArrowUpRight className="w-4 h-4" />
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(safeStats.topProducts || []).map((product: any, index: number) => (
                <div key={product.name || index} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} sold</p>
                    </div>
                  </div>
                  <span className="font-semibold">₵{product.revenue.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {isSuperAdmin && safeStats.vendorStats.length > 0 && (
        <Card id="vendor-performance-section" className="border-primary/20 bg-primary/[0.02]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <CardTitle>Vendor Performance</CardTitle>
            </div>
            <CardDescription>Revenue and sales breakdown by individual vendor</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Vendor</th>
                    <th className="h-10 px-2 text-right align-middle font-medium text-muted-foreground">Orders</th>
                    <th className="h-10 px-2 text-right align-middle font-medium text-muted-foreground">Revenue</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {safeStats.vendorStats.map((vendor: ApiVendorStat) => (
                    <tr key={vendor.vendor_id} className="border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <td className="p-2 align-middle font-medium text-primary cursor-default">
                        {vendor.vendor_name}
                      </td>
                      <td className="p-2 align-middle text-right">{vendor.total_sales}</td>
                      <td className="p-2 align-middle text-right font-bold text-green-600">₵{vendor.total_revenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminHome;

