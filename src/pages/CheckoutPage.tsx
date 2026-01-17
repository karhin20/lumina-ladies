import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, MapPin, Truck, Check, CreditCard, ShoppingBag, Store } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { api } from '@/lib/api';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { regions, cities } from "@/data/locations";

const CheckoutPage = () => {
    const { user, sessionToken, updateProfile, isLoading: isAuthLoading } = useAuth();
    const { items, totalPrice, clearCart } = useCart();
    const navigate = useNavigate();
    const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'pickup'>('delivery');
    const { toast } = useToast();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditingAddress, setIsEditingAddress] = useState(false);

    // Address form state
    const [addressName, setAddressName] = useState('');
    const [addressPhone, setAddressPhone] = useState('');
    const [addressStreet, setAddressStreet] = useState('');
    const [addressCity, setAddressCity] = useState('');
    const [addressRegion, setAddressRegion] = useState('');

    useEffect(() => {
        if (!isAuthLoading && !user) {
            navigate('/auth?redirect=/checkout');
        }
        if (user) {
            if (user.address) {
                setAddressName(user.address.name);
                setAddressPhone(user.address.phone);
                setAddressStreet(user.address.street);
                setAddressCity(user.address.city);
                setAddressRegion(user.address.region);
            } else {
                setAddressName(user.name || '');
                setAddressPhone(user.phone || '');
                setIsEditingAddress(true);
            }
        }
    }, [user, isAuthLoading, navigate]);

    const handlePlaceOrder = async () => {
        if (!sessionToken) return;

        // Validate address
        if (deliveryMethod === 'delivery') {
            if (!addressName || !addressPhone || !addressStreet || !addressCity || !addressRegion) {
                toast({
                    title: 'Incomplete address',
                    description: 'Please provide all delivery details.',
                    variant: 'destructive',
                });
                setIsEditingAddress(true);
                return;
            }
        } else {
            // Pickup validation
            if (!addressName || !addressPhone) {
                toast({
                    title: 'Incomplete contact details',
                    description: 'Please provide your name and phone number for pickup.',
                    variant: 'destructive',
                });
                return;
            }
        }

        setIsSubmitting(true);
        try {

            let shippingAddress;

            if (deliveryMethod === 'pickup') {
                shippingAddress = {
                    name: addressName,
                    phone: addressPhone,
                    street: "PICKUP - 07 Kingsby Street",
                    city: "Achimota",
                    region: "Greater Accra"
                };
            } else {
                shippingAddress = {
                    name: addressName,
                    phone: addressPhone,
                    street: addressStreet,
                    city: addressCity,
                    region: addressRegion,
                };
            }

            // 1. Update profile with address if it's new or changed (only for delivery)
            if (isEditingAddress && deliveryMethod === 'delivery') {
                await updateProfile({ address: shippingAddress });
            }

            // 2. Create order
            const orderPayload = {
                items: items.map(item => ({
                    product_id: item.id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price,
                    image_url: item.image,
                })),
                total: totalPrice,
                shipping: shippingAddress,
            };

            await api.createOrder(orderPayload, sessionToken);

            // 3. Success!
            clearCart();
            toast({
                title: 'Order Placed!',
                description: 'Thank you for your order. We will contact you shortly for delivery.',
            });
            navigate('/account');
        } catch (error: any) {
            toast({
                title: 'Order failed',
                description: error.message || 'Something went wrong. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isAuthLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-background flex flex-col">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center p-4">
                    <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
                    <p className="text-muted-foreground mb-6">Add some products before checking out.</p>
                    <Button asChild>
                        <Link to="/products">Browse Products</Link>
                    </Button>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-secondary/30 flex flex-col">
            <Header />

            <main className="flex-1 pt-24 pb-16">
                <div className="container mx-auto px-4 lg:px-8">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        <span className="text-sm font-medium">Continue Shopping</span>
                    </Link>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column: Forms */}
                        <div className="lg:col-span-2 space-y-6">
                            <h1 className="text-3xl font-bold font-display mb-2">Checkout</h1>

                            {/* Delivery Options */}
                            <Card className="border-none shadow-sm overflow-hidden">
                                <CardHeader className="bg-background pb-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-primary" />
                                            <CardTitle className="text-xl">Delivery Method</CardTitle>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    <div className="flex p-1 bg-secondary rounded-lg mb-6">
                                        <button
                                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${deliveryMethod === 'delivery' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                            onClick={() => setDeliveryMethod('delivery')}
                                        >
                                            Delivery
                                        </button>
                                        <button
                                            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${deliveryMethod === 'pickup' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                            onClick={() => setDeliveryMethod('pickup')}
                                        >
                                            Pickup (Free)
                                        </button>
                                    </div>

                                    {deliveryMethod === 'pickup' ? (
                                        <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                                            <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl space-y-3">
                                                <div className="flex items-start gap-3">
                                                    <Store className="w-5 h-5 text-primary mt-0.5" />
                                                    <div>
                                                        <h4 className="font-semibold">Pickup Location</h4>
                                                        <p className="text-sm text-muted-foreground mt-1">
                                                            07 Kingsby Street<br />
                                                            Achimota, Greater Accra
                                                        </p>
                                                        <a
                                                            href="https://maps.app.goo.gl/56oNs8wnYaYMYg1b7"
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-xs text-primary underline mt-2 inline-block hover:text-primary/80"
                                                        >
                                                            View on Google Maps
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="font-medium text-sm">Contact Details for Pickup</h4>
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="pickup-name">Name</Label>
                                                        <Input
                                                            id="pickup-name"
                                                            value={addressName}
                                                            onChange={e => setAddressName(e.target.value)}
                                                            placeholder="Who will pick up?"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="pickup-phone">Phone Number</Label>
                                                        <Input
                                                            id="pickup-phone"
                                                            value={addressPhone}
                                                            onChange={e => setAddressPhone(e.target.value)}
                                                            placeholder="Contact number"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">Shipping Address</span>
                                                    {!isEditingAddress && (
                                                        <span className="text-xs text-muted-foreground">Where should we deliver your order?</span>
                                                    )}
                                                </div>
                                                {!isEditingAddress && (
                                                    <Button variant="ghost" size="sm" onClick={() => setIsEditingAddress(true)}>
                                                        Change
                                                    </Button>
                                                )}
                                            </div>

                                            {isEditingAddress ? (
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="name">Recipient Name</Label>
                                                        <Input
                                                            id="name"
                                                            value={addressName}
                                                            onChange={e => setAddressName(e.target.value)}
                                                            placeholder="Full Name"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="phone">Phone Number</Label>
                                                        <Input
                                                            id="phone"
                                                            value={addressPhone}
                                                            onChange={e => setAddressPhone(e.target.value)}
                                                            placeholder="Contact number for delivery"
                                                        />
                                                    </div>
                                                    <div className="sm:col-span-2 space-y-2">
                                                        <Label htmlFor="street">Street Address / Landmark</Label>
                                                        <Input
                                                            id="street"
                                                            value={addressStreet}
                                                            onChange={e => setAddressStreet(e.target.value)}
                                                            placeholder="e.g. Opposite the Total Station, East Legon"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="region">Region</Label>
                                                        <Select
                                                            value={addressRegion}
                                                            onValueChange={(value) => {
                                                                setAddressRegion(value);
                                                                setAddressCity(""); // Reset city when region changes
                                                            }}
                                                        >
                                                            <SelectTrigger id="region">
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
                                                        <Label htmlFor="city">City / Town</Label>
                                                        {addressRegion && cities[addressRegion] ? (
                                                            <Select
                                                                value={addressCity}
                                                                onValueChange={setAddressCity}
                                                            >
                                                                <SelectTrigger id="city">
                                                                    <SelectValue placeholder="Select City" />
                                                                </SelectTrigger>
                                                                <SelectContent className="max-h-[300px]">
                                                                    {cities[addressRegion].map((city) => (
                                                                        <SelectItem key={city} value={city}>
                                                                            {city}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        ) : (
                                                            <Input
                                                                id="city"
                                                                value={addressCity}
                                                                onChange={e => setAddressCity(e.target.value)}
                                                                placeholder="Enter City"
                                                            />
                                                        )}
                                                    </div>
                                                    {user.address && (
                                                        <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
                                                            <Button variant="ghost" onClick={() => {
                                                                setAddressName(user.address!.name);
                                                                setAddressPhone(user.address!.phone);
                                                                setAddressStreet(user.address!.street);
                                                                setAddressCity(user.address!.city);
                                                                setAddressRegion(user.address!.region);
                                                                setIsEditingAddress(false);
                                                            }}>
                                                                Cancel
                                                            </Button>
                                                            <Button onClick={() => setIsEditingAddress(false)}>Confirm Address</Button>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="p-4 rounded-xl border-2 border-primary/20 bg-primary/5 flex items-start gap-4">
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-lg">{addressName}</p>
                                                        <p className="text-muted-foreground">{addressPhone}</p>
                                                        <div className="h-px bg-border/50 my-2" />
                                                        <p className="text-sm">
                                                            {addressStreet}, {addressRegion}, {addressCity}
                                                        </p>
                                                    </div>
                                                    <div className="bg-primary rounded-full p-1 shadow-sm">
                                                        <Check className="w-4 h-4 text-primary-foreground" />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Payment Method */}
                            <Card className="border-none shadow-sm">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-primary" />
                                        <CardTitle className="text-xl">Payment Method</CardTitle>
                                    </div>
                                    <CardDescription>Select how you want to pay</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-2">
                                    <div className="p-4 rounded-xl border-2 border-primary bg-primary/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Truck className="w-6 h-6 text-primary" />
                                            <div>
                                                <p className="font-semibold">Cash on Delivery</p>
                                                <p className="text-xs text-muted-foreground">Pay in cash or with MoMo when you receive your order</p>
                                            </div>
                                        </div>
                                        <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                                            <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="space-y-6">
                            <Card className="border-none shadow-lg sticky top-24">
                                <CardHeader>
                                    <CardTitle className="text-xl">Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-3 max-h-[30vh] overflow-y-auto pr-2">
                                        {items.map(item => (
                                            <div key={item.id} className="flex gap-4">
                                                <div className="w-16 h-16 rounded-md overflow-hidden bg-secondary flex-shrink-0">
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                                                    <p className="text-xs text-muted-foreground">{item.quantity} x ₵{item.price.toFixed(2)}</p>
                                                </div>
                                                <p className="text-sm font-semibold">₵{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-2 pt-4 border-t border-border">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span className="font-medium">₵{totalPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Delivery Fee</span>
                                            <span className="text-green-600 font-medium">{deliveryMethod === 'pickup' ? 'Free (Pickup)' : 'Free'}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold pt-2">
                                            <span>Total</span>
                                            <span className="text-primary">₵{totalPrice.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        className="w-full h-12 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
                                        onClick={handlePlaceOrder}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                                                Placing Order...
                                            </div>
                                        ) : 'Place Order'}
                                    </Button>
                                </CardFooter>
                            </Card>

                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex gap-3">
                                <Truck className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                                <p className="text-xs text-yellow-800 leading-relaxed">
                                    <strong>Same-day delivery:</strong> Place your order before 11:00 AM for same-day delivery in selected regions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default CheckoutPage;

