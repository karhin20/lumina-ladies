import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  User, Package, Heart, MapPin, LogOut, ArrowLeft, 
  Edit2, Trash2, Plus, ShoppingBag
} from 'lucide-react';
import { mockAddresses, mockWishlist, Address, WishlistItem, Order } from '@/data/mockData';
import { useMyOrders } from '@/hooks/useMyOrders';

const AccountPage = () => {
  const { user, isLoading, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: orders = [], isLoading: isLoadingOrders } = useMyOrders();
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(mockWishlist);
  
  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email || '');
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Redirect admin to admin dashboard
  if (user.role === 'admin') {
    navigate('/admin');
    return null;
  }

  const handleLogout = async () => {
    await logout();
    toast({
      title: 'Logged out',
      description: 'See you again soon!',
    });
    navigate('/');
  };

  const handleUpdateProfile = async () => {
    await updateProfile({ name: editName, email: editEmail });
    setIsEditingProfile(false);
    toast({
      title: 'Profile updated',
      description: 'Your profile has been updated successfully.',
    });
  };

  const handleRemoveFromWishlist = (id: string) => {
    setWishlist(wishlist.filter(item => item.id !== id));
    toast({
      title: 'Removed from wishlist',
    });
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    toast({
      title: 'Default address updated',
    });
  };

  const getStatusColor = (status: Order['status']) => {
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Store
          </Link>
          <h1 className="font-display text-xl font-semibold">My Account</h1>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-xl">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Orders</span>
            </TabsTrigger>
            <TabsTrigger value="wishlist" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Wishlist</span>
            </TabsTrigger>
            <TabsTrigger value="addresses" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:inline">Addresses</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Manage your personal details</CardDescription>
                  </div>
                  {!isEditingProfile && (
                    <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)}>
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditingProfile ? (
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email (optional)</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateProfile}>Save Changes</Button>
                      <Button variant="outline" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 max-w-md">
                    <div>
                      <Label className="text-muted-foreground">Full Name</Label>
                      <p className="text-lg font-medium">{user.name}</p>
                    </div>
                    {user.phone && (
                      <div>
                        <Label className="text-muted-foreground">Phone Number</Label>
                        <p className="text-lg font-medium">{user.phone}</p>
                      </div>
                    )}
                    {user.email && (
                      <div>
                        <Label className="text-muted-foreground">Email</Label>
                        <p className="text-lg font-medium">{user.email}</p>
                      </div>
                    )}
                    <div>
                      <Label className="text-muted-foreground">Member Since</Label>
                      <p className="text-lg font-medium">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })
                          : '—'}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Order History</CardTitle>
                <CardDescription>View and track your orders</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingOrders ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Loading orders...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No orders yet</p>
                    <Button asChild>
                      <Link to="/">Start Shopping</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="border-border/50">
                        <CardContent className="p-4">
                          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                            <div>
                              <p className="font-semibold">{order.id}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(order.date).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge className={getStatusColor(order.status)}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </Badge>
                              <span className="font-semibold">₵{order.total.toFixed(2)}</span>
                            </div>
                          </div>
                          <div className="flex gap-3 overflow-x-auto pb-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex-shrink-0 flex items-center gap-3 bg-muted/50 rounded-lg p-2 pr-4">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div>
                                  <p className="text-sm font-medium">{item.name}</p>
                                  <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <Card>
              <CardHeader>
                <CardTitle>My Wishlist</CardTitle>
                <CardDescription>Items you've saved for later</CardDescription>
              </CardHeader>
              <CardContent>
                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Your wishlist is empty</p>
                    <Button asChild>
                      <Link to="/">Explore Products</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {wishlist.map((item) => (
                      <Card key={item.id} className="border-border/50 overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-40 object-cover"
                        />
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-1">{item.name}</h3>
                          <p className="text-lg font-semibold text-primary mb-3">₵{item.price.toFixed(2)}</p>
                          <div className="flex gap-2">
                            <Button size="sm" className="flex-1">
                              <ShoppingBag className="w-4 h-4 mr-2" />
                              Add to Cart
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRemoveFromWishlist(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Saved Addresses</CardTitle>
                    <CardDescription>Manage your delivery addresses</CardDescription>
                  </div>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Address
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">No addresses saved</p>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Address
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {addresses.map((address) => (
                      <Card key={address.id} className={`border-border/50 ${address.isDefault ? 'ring-2 ring-primary' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium">{address.name}</p>
                              <p className="text-sm text-muted-foreground">{address.phone}</p>
                            </div>
                            {address.isDefault && (
                              <Badge variant="secondary">Default</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {address.street}<br />
                            {address.city}, {address.region}
                          </p>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit2 className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            {!address.isDefault && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSetDefaultAddress(address.id)}
                              >
                                Set as Default
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AccountPage;
