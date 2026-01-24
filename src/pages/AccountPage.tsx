import { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router';
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
  Edit2, Trash2, Plus, ShoppingBag, ChevronRight, Settings
} from 'lucide-react';
import { mockAddresses, Address } from '@/data/mockData';
import { useMyOrders } from '@/hooks/useMyOrders';
import { useProducts } from '@/hooks/useProducts';
import { ApiOrder } from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { regions, cities } from "@/data/locations";

const AccountPage = () => {
  const { user, isLoading, logout, updateProfile, toggleFavorite, sessionToken } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: orders = [], isLoading: isLoadingOrders } = useMyOrders();
  const { data: allProducts, isLoading: isLoadingProducts } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'profile';
  // Delete account state
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const { api } = require("@/lib/api"); // Dynamically require to avoid circular dependency if any, or just import top level

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;

    setIsDeletingAccount(true);
    try {
      if (sessionToken) {
        // We import api at top level but let's use the object
        const { api } = await import("@/lib/api");
        await api.deleteAccount(sessionToken);
        await logout();
        toast({
          title: "Account Deleted",
          description: "Your account has been permanently deleted.",
        });
        navigate("/");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete account.",
        variant: "destructive",
      });
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  // Derived state for wishlist based on user favorites and all products
  const wishlist = user?.favorites && allProducts
    ? allProducts.filter(p => user.favorites.includes(p.id))
    : [];

  // Profile edit state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Address edit state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editAddressName, setEditAddressName] = useState('');
  const [editAddressPhone, setEditAddressPhone] = useState('');
  const [editAddressStreet, setEditAddressStreet] = useState('');
  const [editAddressCity, setEditAddressCity] = useState('');
  const [editAddressRegion, setEditAddressRegion] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
    if (user) {
      setEditName(user.name);
      setEditEmail(user.email || '');
      setEditPhone(user.phone || '');
      // Initialize address edit fields
      if (user.address) {
        setEditAddressName(user.address.name);
        setEditAddressPhone(user.address.phone);
        setEditAddressStreet(user.address.street);
        setEditAddressCity(user.address.city);
        setEditAddressRegion(user.address.region);
      }
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground flex items-center gap-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-100" />
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce delay-200" />
        </div>
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
    try {
      await updateProfile({ name: editName, email: editEmail, phone: editPhone });
      setIsEditingProfile(false);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Update failed',
        description: 'Could not update profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveFromWishlist = async (id: string, name: string) => {
    await toggleFavorite(id);
    toast({
      title: 'Removed from wishlist',
      description: `${name} has been removed.`,
    });
  };

  const handleSaveAddress = async () => {
    try {
      const addressData = {
        name: editAddressName,
        phone: editAddressPhone,
        street: editAddressStreet,
        city: editAddressCity,
        region: editAddressRegion,
      };
      await updateProfile({ address: addressData });
      setIsEditingAddress(false);
      toast({
        title: 'Address saved',
        description: 'Your delivery address has been updated.',
      });
    } catch (error) {
      toast({
        title: 'Save failed',
        description: 'Could not save address. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleStartEditAddress = () => {
    if (user?.address) {
      setEditAddressName(user.address.name);
      setEditAddressPhone(user.address.phone);
      setEditAddressStreet(user.address.street);
      setEditAddressCity(user.address.city);
      setEditAddressRegion(user.address.region);
    } else {
      // Clear fields for new address
      setEditAddressName('');
      setEditAddressPhone('');
      setEditAddressStreet('');
      setEditAddressCity('');
      setEditAddressRegion('');
    }
    setIsEditingAddress(true);
  };

  const getStatusColor = (status: ApiOrder['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'processing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'shipped': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'delivered': return 'bg-green-50 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border/40">
        <div className="container mx-auto px-4 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="font-medium">Store</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="flex flex-col md:flex-row gap-8 lg:gap-12"
          >

            {/* Sidebar Navigation */}
            <nav className="w-full md:w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-8">
                <div>
                  <h1 className="font-display text-3xl font-bold mb-2">Account</h1>
                  <p className="text-muted-foreground text-sm">Manage your orders and preferences.</p>
                </div>

                <TabsList className="flex flex-col h-auto bg-transparent p-0 space-y-2 w-full items-stretch">
                  {[
                    { value: "profile", label: "Profile", icon: User },
                    { value: "orders", label: "Orders", icon: Package },
                    { value: "wishlist", label: "Wishlist", icon: Heart },
                    { value: "addresses", label: "Addresses", icon: MapPin },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.value}
                      value={tab.value}
                      className="flex items-center justify-start gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg hover:bg-muted justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-0 group-data-[state=active]:opacity-100 transition-opacity" />
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
            </nav>

            {/* Content Area */}
            <div className="flex-1 min-w-0 animate-fade-in">

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6 mt-0">
                <Card className="border-none shadow-sm bg-background">
                  <CardHeader className="pb-4 border-b border-border/40">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">Personal Information</CardTitle>
                        <CardDescription>Update your personal details here.</CardDescription>
                      </div>
                      {!isEditingProfile && (
                        <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)} className="gap-2">
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    {isEditingProfile ? (
                      <div className="space-y-6 max-w-md animate-scale-in">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                              id="name"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="bg-secondary/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                              id="email"
                              type="email"
                              value={editEmail}
                              onChange={(e) => setEditEmail(e.target.value)}
                              className="bg-secondary/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={editPhone}
                              onChange={(e) => setEditPhone(e.target.value)}
                              className="bg-secondary/50"
                              placeholder="+233..."
                            />
                          </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Button onClick={handleUpdateProfile} className="gap-2">
                            Save Changes
                          </Button>
                          <Button variant="ghost" onClick={() => setIsEditingProfile(false)}>Cancel</Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid gap-6 md:grid-cols-2">
                        <div className="p-4 rounded-lg bg-secondary/30 space-y-1">
                          <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Full Name</Label>
                          <p className="text-lg font-medium">{user.name}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-secondary/30 space-y-1">
                          <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Email</Label>
                          <p className="text-lg font-medium">{user.email}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-secondary/30 space-y-1">
                          <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Phone</Label>
                          <p className="text-lg font-medium">{user.phone || '—'}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-secondary/30 space-y-1">
                          <Label className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Joined</Label>
                          <p className="text-lg font-medium">
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                              : '—'}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Danger Zone */}
                <Card className="border-destructive/30 shadow-sm bg-destructive/5">
                  <CardHeader className="pb-4 border-b border-destructive/20">
                    <CardTitle className="text-xl text-destructive">Danger Zone</CardTitle>
                    <CardDescription>Irreversible account actions.</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Delete Account</p>
                        <p className="text-sm text-muted-foreground">Permanently remove your account and all data.</p>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={isDeletingAccount}
                      >
                        {isDeletingAccount ? "Deleting..." : "Delete Account"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Orders Tab */}
              <TabsContent value="orders" className="space-y-6 mt-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-2xl font-semibold font-display">Order History</h2>
                    <p className="text-muted-foreground">Track and manage your orders.</p>
                  </div>
                </div>

                {isLoadingOrders ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4 text-muted-foreground">
                    <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p>Loading your orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16 bg-background rounded-2xl border border-dashed border-border">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No orders yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">When you place an order, it will appear here.</p>
                    <Button asChild className="gap-2 rounded-full px-6">
                      <Link to="/">
                        Start Shopping <ArrowLeft className="w-4 h-4 rotate-180" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Card key={order.id} className="overflow-hidden border-border/60 hover:shadow-md transition-shadow duration-300">
                        <div className="bg-secondary/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60">
                          <div className="flex gap-4 sm:gap-8 text-sm">
                            <div>
                              <span className="block text-muted-foreground text-xs uppercase tracking-wider mb-0.5">Order Placed</span>
                              <span className="font-medium">
                                {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                            <div>
                              <span className="block text-muted-foreground text-xs uppercase tracking-wider mb-0.5">Total</span>
                              <span className="font-medium">₵{order.total.toFixed(2)}</span>
                            </div>
                            <div className="hidden sm:block">
                              <span className="block text-muted-foreground text-xs uppercase tracking-wider mb-0.5">Order ID</span>
                              <span className="font-mono text-muted-foreground">#{order.id.slice(0, 8)}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className={`${getStatusColor(order.status)} border capitalize px-3 py-1`}>
                            {order.status}
                          </Badge>
                        </div>
                        <CardContent className="p-4 sm:p-6">
                          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex-shrink-0 group relative">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden bg-muted border border-border/50">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                </div>
                                <div className="absolute -bottom-2 -right-2 bg-background border border-border text-xs w-6 h-6 flex items-center justify-center rounded-full shadow-sm font-medium">
                                  {item.quantity}
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Wishlist Tab */}
              <TabsContent value="wishlist" className="space-y-6 mt-0">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold font-display">Wishlist</h2>
                  <p className="text-muted-foreground">Saved items you want to buy later.</p>
                </div>

                {wishlist.length === 0 ? (
                  <div className="text-center py-16 bg-background rounded-2xl border border-dashed border-border">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">Your wishlist is empty</h3>
                    <p className="text-muted-foreground mb-6">Explore our collection and find something you love.</p>
                    <Button asChild className="gap-2 rounded-full px-6">
                      <Link to="/products">Explore Products</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {wishlist.map((item) => (
                      <Card key={item.id} className="group overflow-hidden border-border/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                        <div className="aspect-[4/3] bg-muted overflow-hidden relative">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <button
                            onClick={() => handleRemoveFromWishlist(item.id, item.name)}
                            className="absolute top-3 right-3 p-2 bg-background/90 backdrop-blur-sm rounded-full text-destructive hover:bg-destructive hover:text-white transition-all shadow-sm opacity-100"
                            title="Remove"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium mb-1 line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h3>
                          <p className="text-lg font-semibold text-foreground mb-4">₵{item.price.toFixed(2)}</p>
                          <Button asChild className="w-full gap-2 transition-all active:scale-95">
                            <Link to={`/product/${item.id}`}>
                              <ShoppingBag className="w-4 h-4" />
                              View Product
                            </Link>
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Addresses Tab */}
              <TabsContent value="addresses" className="space-y-6 mt-0">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold font-display">Delivery Address</h2>
                    <p className="text-muted-foreground">Manage your shipping address.</p>
                  </div>
                  {!isEditingAddress && (
                    <Button size="sm" className="gap-2" onClick={handleStartEditAddress}>
                      {user.address ? (
                        <>
                          <Edit2 className="w-4 h-4" />
                          Edit
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          Add Address
                        </>
                      )}
                    </Button>
                  )}
                </div>

                {isEditingAddress ? (
                  <Card className="border-none shadow-sm bg-background">
                    <CardHeader className="pb-4 border-b border-border/40">
                      <CardTitle className="text-xl">
                        {user.address ? 'Edit Address' : 'Add New Address'}
                      </CardTitle>
                      <CardDescription>Enter your delivery address details.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-4 max-w-md animate-scale-in">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="addressName">Full Name</Label>
                            <Input
                              id="addressName"
                              value={editAddressName}
                              onChange={(e) => setEditAddressName(e.target.value)}
                              className="bg-secondary/50"
                              placeholder="John Doe"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="addressPhone">Phone Number</Label>
                            <Input
                              id="addressPhone"
                              type="tel"
                              value={editAddressPhone}
                              onChange={(e) => setEditAddressPhone(e.target.value)}
                              className="bg-secondary/50"
                              placeholder="0201234567"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="addressStreet">Street Address</Label>
                          <Input
                            id="addressStreet"
                            value={editAddressStreet}
                            onChange={(e) => setEditAddressStreet(e.target.value)}
                            className="bg-secondary/50"
                            placeholder="123 Main Street"
                          />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="addressRegion">Region</Label>
                            <Select
                              value={editAddressRegion}
                              onValueChange={(value) => {
                                setEditAddressRegion(value);
                                setEditAddressCity("");
                              }}
                            >
                              <SelectTrigger id="addressRegion" className="bg-secondary/50">
                                <SelectValue placeholder="Select Region" />
                              </SelectTrigger>
                              <SelectContent>
                                {regions.map((region) => (
                                  <SelectItem key={region} value={region}>
                                    {region}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="addressCity">City / Town</Label>
                            {editAddressRegion && cities[editAddressRegion] ? (
                              <Select
                                value={editAddressCity}
                                onValueChange={setEditAddressCity}
                              >
                                <SelectTrigger id="addressCity" className="bg-secondary/50">
                                  <SelectValue placeholder="Select City" />
                                </SelectTrigger>
                                <SelectContent className="max-h-[300px]">
                                  {cities[editAddressRegion].map((city) => (
                                    <SelectItem key={city} value={city}>
                                      {city}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Input
                                id="addressCity"
                                value={editAddressCity}
                                onChange={(e) => setEditAddressCity(e.target.value)}
                                className="bg-secondary/50"
                                placeholder="Enter City"
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Button onClick={handleSaveAddress} className="gap-2">
                            Save Address
                          </Button>
                          <Button variant="ghost" onClick={() => setIsEditingAddress(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ) : user.address ? (
                  <Card className="border-primary ring-1 ring-primary bg-primary/5 transition-all duration-300 hover:shadow-md max-w-md">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center border shadow-sm">
                          <MapPin className="w-5 h-5 text-primary" />
                        </div>
                        <Badge className="bg-primary text-primary-foreground">Default</Badge>
                      </div>

                      <div className="space-y-1 mb-6">
                        <p className="font-semibold text-lg">{user.address.name}</p>
                        <p className="text-muted-foreground">{user.address.phone}</p>
                        <div className="h-px bg-border/50 my-3" />
                        <p className="text-sm leading-relaxed">
                          {user.address.street}<br />
                          {user.address.region}, {user.address.city}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="text-center py-16 bg-background rounded-2xl border border-dashed border-border max-w-md">
                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <MapPin className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No address saved</h3>
                    <p className="text-muted-foreground mb-6">Add your delivery address to make checkout faster.</p>
                    <Button onClick={handleStartEditAddress} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Address
                    </Button>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AccountPage;

