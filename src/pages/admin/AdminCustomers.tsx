import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from '@/components/ui/table';
import { Search, Eye, Mail, User, Phone, Calendar, ShoppingBag, ArrowUpDown, ChevronUp, ChevronDown, ArrowUpRight } from 'lucide-react';
import { useAdminCustomers } from '@/hooks/useAdminCustomers';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import { getValidImageUrl } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ApiAdminCustomer } from '@/lib/api';
import { cn } from '@/lib/utils';

const AdminCustomers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<ApiAdminCustomer | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof ApiAdminCustomer; direction: 'asc' | 'desc' } | null>(null);

  const { data: customers = [], isLoading } = useAdminCustomers();
  const { data: allOrders = [] } = useAdminOrders();

  const handleSort = (key: keyof ApiAdminCustomer) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const SortIndicator = ({ columnKey }: { columnKey: keyof ApiAdminCustomer }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />;
    return sortConfig.direction === 'asc'
      ? <ChevronUp className="ml-2 h-3 w-3 text-primary font-bold" />
      : <ChevronDown className="ml-2 h-3 w-3 text-primary font-bold" />;
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.phone || '').includes(searchQuery) ||
    (customer.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    const aValue = a[key] ?? '';
    const bValue = b[key] ?? '';

    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery': return 'bg-orange-100 text-orange-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const customerOrders = selectedCustomer
    ? allOrders.filter(order => order.user_id === selectedCustomer.user_id)
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-semibold">Customers</h1>
        <p className="text-muted-foreground">View and manage your customers</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{customers.length}</p>
                <p className="text-sm text-muted-foreground">Total Customers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-100">
                <User className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {customers.filter(c => c.orders > 0).length}
                </p>
                <p className="text-sm text-muted-foreground">Active Buyers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-100">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  ₵{customers.reduce((sum, c) => sum + c.total_spent, 0).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>All Customers</CardTitle>
              <CardDescription>Manage your customer base</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">Customer <SortIndicator columnKey="name" /></div>
                    </TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('orders')}
                    >
                      <div className="flex items-center">Orders <SortIndicator columnKey="orders" /></div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('total_spent')}
                    >
                      <div className="flex items-center">Total Spent <SortIndicator columnKey="total_spent" /></div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('joined_at')}
                    >
                      <div className="flex items-center">Joined <SortIndicator columnKey="joined_at" /></div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        Loading customers...
                      </TableCell>
                    </TableRow>
                  ) : sortedCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No customers found
                      </TableCell>
                    </TableRow>
                  ) : sortedCustomers.map((customer, index) => (
                    <TableRow key={customer.user_id || index}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-primary font-semibold">
                              {customer.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-muted-foreground">{customer.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{customer.orders} orders</Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        ₵{customer.total_spent.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {new Date(customer.joined_at).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="grid gap-4 md:hidden">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading customers...</div>
            ) : sortedCustomers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No customers found</div>
            ) : sortedCustomers.map((customer, index) => (
              <Card key={customer.user_id || index} className="border-border bg-card/50 overflow-hidden">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-primary font-bold text-lg">
                        {customer.name.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate">{customer.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{customer.email}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <Badge variant="secondary" className="text-[10px] h-4 px-1">{customer.orders} orders</Badge>
                      <p className="font-bold text-accent text-sm mt-1">₵{customer.total_spent.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-2 border-t border-border">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-3 h-3" />
                      {customer.phone || 'No phone'}
                    </div>
                    <div className="text-muted-foreground">
                      Joined {new Date(customer.joined_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-9 gap-2"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      <Eye className="w-4 h-4" />
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card >

      {/* Customer Detail Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={(open) => !open && setSelectedCustomer(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Profile</DialogTitle>
            <DialogDescription>
              Detailed view of customer information and history
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-6 py-4">
              {/* Profile Header */}
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center p-4 bg-muted/30 rounded-xl border border-border">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border-2 border-primary/20">
                  <span className="text-primary font-bold text-3xl">
                    {selectedCustomer.name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 space-y-1">
                  <h2 className="text-2xl font-bold">{selectedCustomer.name}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      {selectedCustomer.email || 'No email provided'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      {selectedCustomer.phone || 'No phone provided'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(selectedCustomer.joined_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
                  <div className="flex items-center gap-3 text-muted-foreground mb-1">
                    <ShoppingBag className="w-4 h-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Total Orders</span>
                  </div>
                  <p className="text-2xl font-bold">{selectedCustomer.orders}</p>
                </div>
                <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
                  <div className="flex items-center gap-3 text-muted-foreground mb-1">
                    <span className="text-lg font-bold">₵</span>
                    <span className="text-xs font-medium uppercase tracking-wider">Total Spent</span>
                  </div>
                  <p className="text-2xl font-bold">₵{selectedCustomer.total_spent.toFixed(2)}</p>
                </div>
              </div>

              {/* Order History */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  Order History
                  <Badge variant="secondary" className="font-normal">{customerOrders.length}</Badge>
                </h3>

                {customerOrders.length === 0 ? (
                  <div className="text-center py-8 bg-muted/20 rounded-lg border border-dashed text-muted-foreground">
                    No orders found for this customer
                  </div>
                ) : (
                  <div className="space-y-3">
                    {customerOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border bg-card/50 hover:bg-card hover:border-primary/50 transition-all cursor-pointer group"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold uppercase tracking-tighter text-muted-foreground group-hover:text-primary transition-colors">
                              #{order.id.slice(0, 8)}
                            </p>
                            <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                          </div>
                          <p className="text-xs">
                            {new Date(order.created_at || '').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <p className="font-bold text-sm">₵{order.total.toFixed(2)}</p>
                          <span
                            className={cn(
                              "text-[10px] h-4 px-1.5 font-medium rounded-full",
                              getOrderStatusColor(order.status)
                            )}
                          >
                            {order.status.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Nested Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Order Details #{selectedOrder?.id?.slice(0, 8)}</DialogTitle>
            <DialogDescription>
              Full breakdown for this transaction
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="grid gap-4 py-4 text-sm">
              <div className="grid grid-cols-2 items-center gap-4 border-b border-border/50 pb-2">
                <p className="text-muted-foreground">Status:</p>
                <div className="text-right">
                  <Badge className={cn(getOrderStatusColor(selectedOrder.status), "text-[10px] px-1.5 h-5")}>
                    {selectedOrder.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <p className="text-muted-foreground">Order Date:</p>
                <p className="font-medium text-right">
                  {new Date(selectedOrder.created_at || '').toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <p className="text-muted-foreground">Shipping To:</p>
                <p className="font-medium text-right">{selectedOrder.shipping?.name}</p>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <p className="text-muted-foreground">Total Amount:</p>
                <p className="font-bold text-right text-lg text-primary">₵{selectedOrder.total?.toFixed(2)}</p>
              </div>

              <div className="space-y-3 mt-4">
                <p className="font-semibold border-b border-border/50 pb-1">Items ({selectedOrder.items?.length})</p>
                <div className="max-h-[220px] overflow-y-auto space-y-2 pr-2">
                  {selectedOrder.items?.map((item: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 bg-muted/30 p-2 rounded-lg border border-border/40">
                      <img
                        src={getValidImageUrl(item.image_url || item.image) || '/placeholder.svg'}
                        alt={item.name}
                        className="w-10 h-10 rounded-md object-cover border border-border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-[11px]">{item.name}</p>
                        <p className="text-[10px] text-muted-foreground">Qty: {item.quantity} x ₵{item.price?.toFixed(2)}</p>
                      </div>
                      <p className="font-bold text-[11px]">₵{(item.quantity * item.price)?.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div >
  );
};

export default AdminCustomers;

