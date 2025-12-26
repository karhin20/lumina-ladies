import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, ShoppingCart, Users, Package, TrendingUp, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAdminStats } from '@/hooks/useAdminStats';

const AdminHome = () => {
  const { data: stats, isLoading } = useAdminStats();

  // Ensure stats is defined and has default values if API returns partial data
  const safeStats = {
    totalRevenue: stats?.total_revenue ?? 0,
    totalOrders: stats?.total_orders ?? 0,
    totalCustomers: stats?.total_customers ?? 0,
    totalProducts: stats?.total_products ?? 0,
    recentOrders: stats?.recent_orders ?? [],
    topProducts: [], // API doesn't seem to return top_products in summary yet, or it's named differently
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₵${(safeStats.totalRevenue || 0).toLocaleString()}`,
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-600 bg-green-100',
    },
    {
      title: 'Total Orders',
      value: (safeStats.totalOrders || 0).toString(),
      change: '+8.2%',
      icon: ShoppingCart,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      title: 'Customers',
      value: (safeStats.totalCustomers || 0).toString(),
      change: '+15.3%',
      icon: Users,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      title: 'Products',
      value: (safeStats.totalProducts || 0).toString(),
      change: '+2',
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
        <p className="text-muted-foreground">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="flex items-center text-sm text-green-600 font-medium">
                  {stat.change}
                  <TrendingUp className="w-4 h-4 ml-1" />
                </span>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
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
    </div>
  );
};

export default AdminHome;
