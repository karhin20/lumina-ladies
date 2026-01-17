import { useState, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Eye, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import { api, ApiOrder } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useVendor } from '@/hooks/useVendor';
import { useProducts } from '@/hooks/useProducts';
import { getValidImageUrl } from '@/lib/utils';

const AdminOrders = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();
  const { sessionToken } = useAuth();
  const { vendor, isVendorAdmin } = useVendor();
  const { data: allOrders = [], isLoading, refetch } = useAdminOrders();
  const { data: products = [] } = useProducts();
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  // Get vendor product IDs for filtering
  const vendorProductIds = isVendorAdmin && vendor
    ? new Set(products.filter(p => (p as any).vendor_id === vendor.id).map(p => p.id))
    : null;

  // Filter orders by vendor for vendor_admin users
  const orders = isVendorAdmin && vendorProductIds
    ? allOrders.filter(order =>
      order.items.some(item => vendorProductIds.has(item.product_id))
    )
    : allOrders;

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.shipping?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;

    let aValue: any;
    let bValue: any;

    if (key === 'customer') {
      aValue = a.shipping?.name || '';
      bValue = b.shipping?.name || '';
    } else if (key === 'date') {
      aValue = a.created_at || '';
      bValue = b.created_at || '';
    } else {
      aValue = (a as any)[key] ?? '';
      bValue = (b as any)[key] ?? '';
    }

    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  // Virtualization setup
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: sortedOrders.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 73, // Approximate row height
    overscan: 5,
  });

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const SortIndicator = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig?.key !== columnKey) return <ArrowUpDown className="ml-2 h-3 w-3 opacity-50" />;
    return sortConfig.direction === 'asc'
      ? <ChevronUp className="ml-2 h-3 w-3 text-primary font-bold" />
      : <ChevronDown className="ml-2 h-3 w-3 text-primary font-bold" />;
  };

  const getStatusColor = (status: string) => {
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

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (!sessionToken) {
      toast({
        title: 'Login required',
        description: 'Sign in as an admin to update orders',
        variant: 'destructive',
      });
      return;
    }
    try {
      await api.updateOrderStatus(orderId, newStatus, sessionToken);
      toast({
        title: 'Order updated',
        description: `Order ${orderId} status changed to ${newStatus}`,
      });
      refetch();
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-semibold">Orders</h1>
        <p className="text-muted-foreground">View and manage customer orders</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>All Orders</CardTitle>
              <CardDescription>{orders.length} total orders</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Desktop Table View - Virtualized */}
          <div className="hidden md:block">
            <div
              ref={parentRef}
              className="rounded-md border h-[600px] overflow-auto relative w-full"
            >
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10 shadow-sm">
                  <TableRow>
                    <TableHead
                      className="w-[120px] cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center">Order <SortIndicator columnKey="id" /></div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('customer')}
                    >
                      <div className="flex items-center">Customer <SortIndicator columnKey="customer" /></div>
                    </TableHead>
                    <TableHead
                      className="hidden sm:table-cell cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center">Date <SortIndicator columnKey="date" /></div>
                    </TableHead>
                    <TableHead className="hidden md:table-cell">Items</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('total')}
                    >
                      <div className="flex items-center">Total <SortIndicator columnKey="total" /></div>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody
                  className="relative"
                  style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                  }}
                >
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground h-24">
                        Loading orders...
                      </TableCell>
                    </TableRow>
                  ) : sortedOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground h-24">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    <>
                      {rowVirtualizer.getVirtualItems().length > 0 && (
                        <tr style={{ height: `${rowVirtualizer.getVirtualItems()[0].start}px` }} />
                      )}
                      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const order = sortedOrders[virtualRow.index];
                        return (
                          <TableRow
                            key={order.id}
                            data-index={virtualRow.index}
                            ref={rowVirtualizer.measureElement}
                          >
                            <TableCell className="font-medium">
                              <div className="flex flex-col">
                                <span className="text-xs text-muted-foreground uppercase tracking-wider">#{order.id.slice(0, 8)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">{order.shipping?.name}</p>
                                <p className="text-sm text-muted-foreground">{order.shipping?.phone}</p>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                              <div className="text-xs">
                                {new Date(order.created_at || '').toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="flex -space-x-2">
                                {order.items.slice(0, 3).map((item, idx) => (
                                  <img
                                    key={idx}
                                    src={getValidImageUrl(item.image_url || (item as any).image) || '/placeholder.svg'}
                                    alt={item.name}
                                    className="w-8 h-8 rounded-full border-2 border-background object-cover"
                                  />
                                ))}
                                {order.items.length > 3 && (
                                  <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                                    +{order.items.length - 3}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="font-bold">₵{order.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <Select
                                value={order.status}
                                onValueChange={(value: ApiOrder['status']) => handleStatusChange(order.id, value)}
                              >
                                <SelectTrigger className="w-[110px] sm:w-32 h-8 px-2 text-xs">
                                  <Badge className={cn(getStatusColor(order.status), "text-[10px] px-1 h-5")}>
                                    {order.status.replace(/_/g, ' ')}
                                  </Badge>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(order)}>
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile View */}
          <div className="grid gap-4 md:hidden">
            {isLoading ? (
              <Card className="overflow-hidden border-border bg-card/50">
                <CardContent className="p-4 text-center text-muted-foreground">
                  Loading orders...
                </CardContent>
              </Card>
            ) : sortedOrders.length === 0 ? (
              <Card className="overflow-hidden border-border bg-card/50">
                <CardContent className="p-4 text-center text-muted-foreground">
                  No orders found
                </CardContent>
              </Card>
            ) : sortedOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden border-border bg-card/50">
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Order #{order.id.slice(0, 8)}</p>
                      <h3 className="font-bold text-sm mt-1">{order.shipping?.name}</h3>
                      <p className="text-xs text-muted-foreground">{order.shipping?.phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-accent">₵{order.total.toFixed(2)}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {new Date(order.created_at || '').toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 py-2">
                    <div className="flex -space-x-2">
                      {order.items.slice(0, 4).map((item, idx) => (
                        <img
                          key={idx}
                          src={getValidImageUrl(item.image_url || (item as any).image) || '/placeholder.svg'}
                          alt={item.name}
                          className="w-7 h-7 rounded-full border-2 border-background object-cover"
                        />
                      ))}
                      {order.items.length > 4 && (
                        <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] border-2 border-background">
                          +{order.items.length - 4}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between gap-3 pt-2">
                    <Select
                      value={order.status}
                      onValueChange={(value: ApiOrder['status']) => handleStatusChange(order.id, value)}
                    >
                      <SelectTrigger className="flex-1 h-9 px-3 text-xs bg-muted/30">
                        <Badge className={cn(getStatusColor(order.status), "text-[10px] px-1.5 h-4")}>
                          {order.status.replace(/_/g, ' ')}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="h-9 gap-2" onClick={() => setSelectedOrder(order)}>
                      <Eye className="w-4 h-4" />
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedOrder && (
        <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Order Details #{selectedOrder.id.slice(0, 8)}</DialogTitle>
              <DialogDescription>
                View the full details of this order.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4 text-sm">
              <div className="grid grid-cols-2 items-center gap-4">
                <p className="text-muted-foreground">Customer Name:</p>
                <p className="font-medium text-right">{selectedOrder.shipping?.name}</p>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <p className="text-muted-foreground">Phone:</p>
                <p className="font-medium text-right">{selectedOrder.shipping?.phone}</p>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <p className="text-muted-foreground">Address:</p>
                <p className="font-medium text-right capitalize">
                  {selectedOrder.shipping?.street}, {selectedOrder.shipping?.city}, {selectedOrder.shipping?.region}
                </p>
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
                <p className="text-muted-foreground">Total Amount:</p>
                <p className="font-bold text-right">₵{selectedOrder.total.toFixed(2)}</p>
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <p className="text-muted-foreground">Status:</p>
                <Badge className={cn(getStatusColor(selectedOrder.status), "text-[10px] px-1.5 h-5 justify-end")}>
                  {selectedOrder.status.replace(/_/g, ' ')}
                </Badge>
              </div>
              <div className="space-y-2 mt-4">
                <p className="font-semibold">Items:</p>
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <img
                      src={getValidImageUrl(item.image_url || (item as any).image) || '/placeholder.svg'}
                      alt={item.name}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity} x ₵{item.price.toFixed(2)}</p>
                    </div>
                    <p className="font-medium">₵{(item.quantity * item.price).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminOrders;

