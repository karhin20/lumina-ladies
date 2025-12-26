import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useVendor } from '@/hooks/useVendor';
import { useAuth } from '@/contexts/AuthContext';
import { api, ApiVendorUpdate } from '@/lib/api';
import { Store, Mail, Phone, MapPin, Image as ImageIcon } from 'lucide-react';

const AdminVendorProfile = () => {
    const { toast } = useToast();
    const { sessionToken } = useAuth();
    const { vendor, isVendorAdmin, refetch } = useVendor();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        logo_url: '',
        banner_url: '',
        contact_email: '',
        contact_phone: '',
        address: {
            street: '',
            city: '',
            region: '',
            postal_code: '',
        },
    });

    useEffect(() => {
        if (vendor) {
            setFormData({
                name: vendor.name || '',
                description: vendor.description || '',
                logo_url: vendor.logo_url || '',
                banner_url: vendor.banner_url || '',
                contact_email: vendor.contact_email || '',
                contact_phone: vendor.contact_phone || '',
                address: {
                    street: vendor.address?.street || '',
                    city: vendor.address?.city || '',
                    region: vendor.address?.region || '',
                    postal_code: vendor.address?.postal_code || '',
                },
            });
        }
    }, [vendor]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sessionToken || !vendor) return;

        setIsSubmitting(true);
        try {
            const updateData: ApiVendorUpdate = {
                name: formData.name,
                description: formData.description || null,
                logo_url: formData.logo_url || null,
                banner_url: formData.banner_url || null,
                contact_email: formData.contact_email || null,
                contact_phone: formData.contact_phone || null,
                address: {
                    street: formData.address.street,
                    city: formData.address.city,
                    region: formData.address.region,
                    postal_code: formData.address.postal_code,
                },
            };

            await api.updateVendor(vendor.id, updateData, sessionToken);
            toast({ title: 'Store updated successfully' });
            refetch();
        } catch (error: any) {
            toast({
                title: 'Failed to update store',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isVendorAdmin) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">
                            This page is only accessible to vendor administrators.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!vendor) {
        return (
            <div className="space-y-6">
                <Card>
                    <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">
                            No vendor associated with your account. Please contact support.
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-2xl lg:text-3xl font-semibold">My Store</h1>
                <p className="text-muted-foreground">Manage your store information and branding</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Store Information</CardTitle>
                        <CardDescription>Update your store details and contact information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Information */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2">
                                        <Store className="w-4 h-4" />
                                        Store Name *
                                    </Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        placeholder="Tell customers about your store..."
                                    />
                                </div>
                            </div>

                            {/* Branding */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" />
                                    Branding
                                </h3>
                                <div className="space-y-2">
                                    <Label htmlFor="logo_url">Logo URL</Label>
                                    <Input
                                        id="logo_url"
                                        type="url"
                                        value={formData.logo_url}
                                        onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                                        placeholder="https://example.com/logo.png"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="banner_url">Banner URL</Label>
                                    <Input
                                        id="banner_url"
                                        type="url"
                                        value={formData.banner_url}
                                        onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
                                        placeholder="https://example.com/banner.png"
                                    />
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Contact Information
                                </h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="contact_email">Email</Label>
                                        <Input
                                            id="contact_email"
                                            type="email"
                                            value={formData.contact_email}
                                            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                                            placeholder="store@example.com"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="contact_phone" className="flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            Phone
                                        </Label>
                                        <Input
                                            id="contact_phone"
                                            type="tel"
                                            value={formData.contact_phone}
                                            onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                                            placeholder="+233 XX XXX XXXX"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="space-y-4 pt-4 border-t">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    Store Address
                                </h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="street">Street Address</Label>
                                        <Input
                                            id="street"
                                            value={formData.address.street}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    address: { ...formData.address, street: e.target.value },
                                                })
                                            }
                                            placeholder="123 Main Street"
                                        />
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                value={formData.address.city}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        address: { ...formData.address, city: e.target.value },
                                                    })
                                                }
                                                placeholder="Accra"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="region">Region</Label>
                                            <Input
                                                id="region"
                                                value={formData.address.region}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        address: { ...formData.address, region: e.target.value },
                                                    })
                                                }
                                                placeholder="Greater Accra"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="postal_code">Postal Code</Label>
                                            <Input
                                                id="postal_code"
                                                value={formData.address.postal_code}
                                                onChange={(e) =>
                                                    setFormData({
                                                        ...formData,
                                                        address: { ...formData.address, postal_code: e.target.value },
                                                    })
                                                }
                                                placeholder="00233"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Store Preview */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Store Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Status</span>
                                <Badge variant={vendor.is_active ? 'default' : 'secondary'}>
                                    {vendor.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Created</span>
                                <span className="text-sm">
                                    {new Date(vendor.created_at).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Last Updated</span>
                                <span className="text-sm">
                                    {new Date(vendor.updated_at).toLocaleDateString('en-GB', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {formData.logo_url && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Logo Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-square rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
                                    <img
                                        src={formData.logo_url}
                                        alt="Store logo"
                                        className="max-w-full max-h-full object-contain"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {formData.banner_url && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Banner Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-[3/1] rounded-lg border overflow-hidden bg-muted">
                                    <img
                                        src={formData.banner_url}
                                        alt="Store banner"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminVendorProfile;
