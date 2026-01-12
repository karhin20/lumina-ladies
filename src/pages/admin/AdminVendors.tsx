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
import { Loader2, Plus, Store, Trash2, UserPlus, UserMinus, Users, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Vendors</h1>
                    <p className="text-sm text-muted-foreground">Manage platform vendors and administrators</p>
                </div>

                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="w-full sm:w-auto">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Vendor
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md w-[95vw] p-4 sm:p-6">
                        <DialogHeader>
                            <DialogTitle>Create New Vendor</DialogTitle>
                            <DialogDescription>
                                Add a new vendor to the platform
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleCreateVendor} className="space-y-4 py-2">
                            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="storeName" className="text-sm font-medium">Store Name</Label>
                                    <Input
                                        id="storeName"
                                        placeholder="Enter store name"
                                        value={newVendor.name}
                                        onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                                        className="h-10"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium">Contact Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="contact@example.com"
                                        value={newVendor.contact_email}
                                        onChange={(e) => setNewVendor({ ...newVendor, contact_email: e.target.value })}
                                        className="h-10"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-sm font-medium">Contact Phone</Label>
                                    <Input
                                        id="phone"
                                        placeholder="+233 ..."
                                        value={newVendor.contact_phone}
                                        onChange={(e) => setNewVendor({ ...newVendor, contact_phone: e.target.value })}
                                        className="h-10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="currency" className="text-sm font-medium">Currency</Label>
                                    <Input id="currency" defaultValue="GHS (₵)" className="h-10" disabled />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                                <Textarea
                                    id="description"
                                    value={newVendor.description}
                                    onChange={(e) => setNewVendor({ ...newVendor, description: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-2">
                                <Button type="button" variant="outline" className="h-10" onClick={() => setIsCreateDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="h-10" disabled={createVendor.isPending}>
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
                <DialogContent className="sm:max-w-md w-[95vw] p-4 sm:p-6">
                    <DialogHeader>
                        <DialogTitle className="text-lg">Manage Vendor Admins</DialogTitle>
                        <DialogDescription className="text-xs">
                            Assign users to manage this vendor
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 pt-2">
                        {/* Current Admins */}
                        <div className="space-y-3">
                            <Label className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Current Admins</Label>
                            {adminsLoading ? (
                                <div className="flex items-center justify-center py-6">
                                    <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                </div>
                            ) : (vendorAdmins as any[]) && (vendorAdmins as any[]).length > 0 ? (
                                <div className="space-y-2 overflow-y-auto max-h-[30vh] pr-1">
                                    {(vendorAdmins as any[]).map((admin: any) => (
                                        <div key={admin.id} className="flex items-center justify-between p-3 border rounded-xl bg-card hover:bg-muted/30 transition-colors">
                                            <div className="min-w-0 flex-1 mr-2">
                                                <p className="font-semibold text-sm truncate">{admin.full_name || admin.email}</p>
                                                <p className="text-[10px] text-muted-foreground truncate">{admin.email}</p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0"
                                                onClick={() => handleRemoveAdmin(admin.id)}
                                            >
                                                <UserMinus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground py-8 text-center border-2 border-dashed rounded-xl">
                                    No admins assigned yet
                                </div>
                            )}
                        </div>

                        {/* Assign New Admin */}
                        <div className="space-y-3">
                            <Label htmlFor="user-select" className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Assign New Admin</Label>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                                    <SelectTrigger className="flex-1 h-10">
                                        <SelectValue placeholder="Select a user" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[30vh]">
                                        {customers.map((customer: any) => (
                                            <SelectItem key={customer.user_id} value={customer.user_id}>
                                                <div className="flex flex-col items-start py-0.5">
                                                    <span className="font-medium text-xs">{customer.name}</span>
                                                    <span className="text-[10px] opacity-70">{customer.email}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    className="h-10 shrink-0"
                                    onClick={handleAssignAdmin}
                                    disabled={!selectedUserId || assignVendorAdmin.isPending}
                                >
                                    {assignVendorAdmin.isPending ? (
                                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                                    ) : (
                                        <>
                                            <UserPlus className="w-4 h-4 mr-1 sm:mr-0 lg:mr-2" />
                                            <span className="sm:hidden lg:inline">Assign</span>
                                        </>
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
                            <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border bg-accent/5 flex items-center justify-center shrink-0">
                                            {vendor.logo_url ? (
                                                <img src={vendor.logo_url} alt={vendor.name} className="w-full h-full rounded-full object-cover" />
                                            ) : (
                                                <Store className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <CardTitle className="flex items-center gap-2 text-base sm:text-lg truncate">
                                                {vendor.name}
                                                {!vendor.is_active && (
                                                    <span className="text-[10px] bg-destructive/10 text-destructive px-1.5 py-0.5 rounded tracking-wide font-bold">
                                                        INACTIVE
                                                    </span>
                                                )}
                                            </CardTitle>
                                            <CardDescription className="text-xs truncate max-w-[200px] sm:max-w-xs">{vendor.description || "No description provided"}</CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 w-full lg:w-auto">
                                        <Button
                                            variant="outline"
                                            className="flex-1 sm:flex-none h-9 text-xs"
                                            onClick={() => setAssignDialogVendorId(vendor.id)}
                                        >
                                            <Users className="w-3.5 h-3.5 mr-1.5" />
                                            Admins
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="flex-1 sm:flex-none h-9 text-xs"
                                            onClick={() => window.open(`/seller/${vendor.slug || vendor.id}`, '_blank')}
                                        >
                                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                                            Visit
                                        </Button>
                                        {vendor.is_active && (
                                            <Button
                                                variant="destructive"
                                                className="h-9 w-9 p-0 shrink-0"
                                                onClick={() => handleDeleteVendor(vendor.id, vendor.name)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t">
                                    <div className="flex items-center justify-between sm:justify-start gap-2">
                                        <span className="text-muted-foreground">Email:</span>
                                        <span className="font-medium truncate">{vendor.contact_email || "Not set"}</span>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-start gap-2">
                                        <span className="text-muted-foreground">Phone:</span>
                                        <span className="font-medium">{vendor.contact_phone || "Not set"}</span>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-start gap-2">
                                        <span className="text-muted-foreground">Joined:</span>
                                        <span className="font-medium">{new Date(vendor.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-start gap-2">
                                        <span className="text-muted-foreground">Status:</span>
                                        <span className={cn("font-bold", vendor.is_active ? "text-green-600" : "text-destructive")}>
                                            {vendor.is_active ? "Active" : "Disabled"}
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
