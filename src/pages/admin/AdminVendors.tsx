import { useState } from "react";
import { useVendors, useCreateVendor, useDeleteVendor, useAssignVendorAdmin, useVendorAdmins, useRemoveVendorAdmin } from "@/hooks/useVendors";
import { useAdminCustomers } from "@/hooks/useAdminCustomers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Store, Trash2, UserPlus, UserMinus, Users } from "lucide-react";
import { VendorCreate } from "@/types/vendor";
import { toast } from "sonner";

const AdminVendors = () => {
    const { data: vendors, isLoading } = useVendors(false);
    const { data: customers = [] } = useAdminCustomers();
    const createVendor = useCreateVendor();
    const deleteVendor = useDeleteVendor();

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [assignDialogVendorId, setAssignDialogVendorId] = useState<string | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [newVendor, setNewVendor] = useState<VendorCreate>({
        name: "",
        description: "",
        contact_email: "",
        contact_phone: "",
        is_active: true,
    });

    const assignVendorAdmin = useAssignVendorAdmin(assignDialogVendorId || "");
    const removeVendorAdmin = useRemoveVendorAdmin(assignDialogVendorId || "");
    const { data: vendorAdmins, isLoading: adminsLoading } = useVendorAdmins(assignDialogVendorId || undefined);

    const handleCreateVendor = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createVendor.mutateAsync(newVendor);
            toast.success("Vendor created successfully");
            setIsCreateDialogOpen(false);
            setNewVendor({
                name: "",
                description: "",
                contact_email: "",
                contact_phone: "",
                is_active: true,
            });
        } catch (error: any) {
            toast.error(error.response?.data?.detail || "Failed to create vendor");
        }
    };

    const handleDeleteVendor = async (vendorId: string, vendorName: string) => {
        if (confirm(`Are you sure you want to deactivate ${vendorName}?`)) {
            try {
                await deleteVendor.mutateAsync(vendorId);
                toast.success("Vendor deactivated successfully");
            } catch (error: any) {
                toast.error(error.response?.data?.detail || "Failed to deactivate vendor");
            }
        }
    };

    const handleAssignAdmin = async () => {
        if (!selectedUserId || !assignDialogVendorId) return;

        try {
            await assignVendorAdmin.mutateAsync(selectedUserId);
            toast.success("Vendor admin assigned successfully");
            setSelectedUserId("");
        } catch (error: any) {
            toast.error(error.message || "Failed to assign vendor admin");
        }
    };

    const handleRemoveAdmin = async (userId: string) => {
        if (!assignDialogVendorId) return;

        if (confirm("Are you sure you want to remove this admin?")) {
            try {
                await removeVendorAdmin.mutateAsync(userId);
                toast.success("Vendor admin removed successfully");
            } catch (error: any) {
                toast.error(error.message || "Failed to remove vendor admin");
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Vendor Management</h1>
                    <p className="text-muted-foreground">Manage vendors and their administrators</p>
                </div>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Vendor
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Create New Vendor</DialogTitle>
                            <DialogDescription>
                                Add a new vendor to the platform
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateVendor} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Vendor Name *</Label>
                                <Input
                                    id="name"
                                    value={newVendor.name}
                                    onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={newVendor.description}
                                    onChange={(e) => setNewVendor({ ...newVendor, description: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Contact Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={newVendor.contact_email}
                                    onChange={(e) => setNewVendor({ ...newVendor, contact_email: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Contact Phone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={newVendor.contact_phone}
                                    onChange={(e) => setNewVendor({ ...newVendor, contact_phone: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={createVendor.isPending}>
                                    {createVendor.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                    Create Vendor
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Assign Admin Dialog */}
            <Dialog open={!!assignDialogVendorId} onOpenChange={(open) => !open && setAssignDialogVendorId(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Manage Vendor Admins</DialogTitle>
                        <DialogDescription>
                            Assign users to manage this vendor
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Current Admins */}
                        <div>
                            <Label className="mb-2 block">Current Admins</Label>
                            {adminsLoading ? (
                                <div className="flex items-center justify-center py-4">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                </div>
                            ) : vendorAdmins && vendorAdmins.length > 0 ? (
                                <div className="space-y-2">
                                    {vendorAdmins.map((admin: any) => (
                                        <div key={admin.id} className="flex items-center justify-between p-2 border rounded">
                                            <div>
                                                <p className="font-medium text-sm">{admin.full_name || admin.email}</p>
                                                <p className="text-xs text-muted-foreground">{admin.email}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveAdmin(admin.id)}
                                            >
                                                <UserMinus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground py-4 text-center">No admins assigned yet</p>
                            )}
                        </div>

                        {/* Assign New Admin */}
                        <div>
                            <Label htmlFor="user-select" className="mb-2 block">Assign New Admin</Label>
                            <div className="flex gap-2">
                                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                    <SelectTrigger className="flex-1">
                                        <SelectValue placeholder="Select a user" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers.map((customer: any) => (
                                            <SelectItem key={customer.user_id} value={customer.user_id}>
                                                {customer.name} ({customer.email})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    onClick={handleAssignAdmin}
                                    disabled={!selectedUserId || assignVendorAdmin.isPending}
                                >
                                    {assignVendorAdmin.isPending ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <UserPlus className="w-4 h-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Vendors List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 w-8 animate-spin text-accent" />
                </div>
            ) : vendors && vendors.length > 0 ? (
                <div className="grid gap-4">
                    {vendors.map((vendor) => (
                        <Card key={vendor.id} className={!vendor.is_active ? "opacity-60" : ""}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                                            {vendor.logo_url ? (
                                                <img src={vendor.logo_url} alt={vendor.name} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <Store className="w-6 h-6 text-accent" />
                                            )}
                                        </div>
                                        <div>
                                            <CardTitle className="flex items-center gap-2">
                                                {vendor.name}
                                                {!vendor.is_active && (
                                                    <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded">
                                                        Inactive
                                                    </span>
                                                )}
                                            </CardTitle>
                                            <CardDescription>{vendor.description || "No description"}</CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setAssignDialogVendorId(vendor.id)}
                                        >
                                            <Users className="w-4 h-4 mr-2" />
                                            Manage Admins
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => window.open(`/seller/${vendor.slug || vendor.id}`, '_blank')}
                                        >
                                            View Store
                                        </Button>
                                        {vendor.is_active && (
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDeleteVendor(vendor.id, vendor.name)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Email:</span>{" "}
                                        <span>{vendor.contact_email || "N/A"}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Phone:</span>{" "}
                                        <span>{vendor.contact_phone || "N/A"}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Created:</span>{" "}
                                        <span>{new Date(vendor.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Status:</span>{" "}
                                        <span className={vendor.is_active ? "text-green-600" : "text-destructive"}>
                                            {vendor.is_active ? "Active" : "Inactive"}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="py-12 text-center text-muted-foreground">
                        <Store className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No vendors yet. Create your first vendor to get started.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AdminVendors;
