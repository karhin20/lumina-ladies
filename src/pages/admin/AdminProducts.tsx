import { useState } from 'react';
import { getValidImageUrl, getStoragePathFromUrl } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

import {
  Search, Plus, MoreVertical, Edit, Trash2,
  Copy, Filter, ChevronLeft, ChevronRight,
  TrendingUp, Download, Eye, Upload, X,
  CheckCircle, XCircle, Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/hooks/useProducts';
import { useAuth } from '@/contexts/AuthContext';
import { useVendor } from '@/hooks/useVendor';
import { api, ApiProduct } from '@/lib/api';
import { Product } from '@/data/products';

const AdminProducts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  const { sessionToken } = useAuth();
  const { vendor, isVendorAdmin } = useVendor();
  const { data: products = [], isLoading, refetch } = useProducts({
    vendorId: isVendorAdmin && vendor ? vendor.id : undefined
  });

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    original_price: '',
    is_new: false,
    is_flash_sale: false,
    flash_sale_end_time: '',
    is_featured: false,
    sales_count: '0',
    details: '', // Comma separated
    video_url: '',
  });

  // Image State
  // We keep track of existing URLs and new Files to upload
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<{ file: File; preview: string }[]>([]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: '', description: '', category: '', price: '',
      original_price: '', is_new: false, is_flash_sale: false,
      flash_sale_end_time: '',
      is_featured: false, sales_count: '0', details: '',
      video_url: ''
    });
    setExistingImages([]);
    setNewFiles([]);
    setEditingProduct(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
    let formattedDate = '';
    if (product.flashSaleEndTime) {
      const date = new Date(product.flashSaleEndTime);
      // Adjust to local ISO string for input
      // This simple hack ensures we get YYYY-MM-DDTHH:mm format roughly correct for local time
      const offset = date.getTimezoneOffset() * 60000;
      formattedDate = new Date(date.getTime() - offset).toISOString().slice(0, 16);
    }

    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      original_price: product.originalPrice?.toString() || '',
      is_new: product.isNew || false,
      is_flash_sale: product.isFlashSale || false,
      flash_sale_end_time: formattedDate,
      is_featured: product.isFeatured || false,
      sales_count: (product.salesCount || 0).toString(),
      details: (product.details || []).join('. '),
      video_url: (product as any).video_url || '',
    });
    setExistingImages(product.images || []);
    setNewFiles([]);
    setIsDialogOpen(true);
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Are you sure you want to delete "${productName}"?`)) return;

    try {
      await api.deleteProduct(productId, sessionToken!);
      toast({ title: "Product deleted" });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Could not delete product",
        variant: "destructive"
      });
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      // Limit to 4 total images
      if (existingImages.length + newFiles.length >= 4) {
        toast({ title: "Limit reached", description: "You can only upload 4 images.", variant: "destructive" });
        return;
      }

      const preview = URL.createObjectURL(file);
      setNewFiles([...newFiles, { file, preview }]);
    }
  };

  const removeNewFile = (index: number) => {
    setNewFiles(newFiles.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (index: number) => {
    const imageUrl = existingImages[index];
    const storagePath = getStoragePathFromUrl(imageUrl);

    if (storagePath && sessionToken) {
      if (confirm("This will permanently delete the image from storage. Continue?")) {
        try {
          await api.deleteImage(storagePath, sessionToken);
          toast({ title: "Image deleted from storage" });
        } catch (error: any) {
          console.error("Failed to delete from storage:", error);
          toast({
            title: "Storage deletion failed",
            description: "The file might already be gone or you don't have permission.",
            variant: "destructive"
          });
          // Continue to remove from UI anyway so the user can save the product without the broken link
        }
      } else {
        return; // User cancelled
      }
    }

    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!sessionToken) return;
    setIsSubmitting(true);

    try {
      // Convert Form Data back to API Payload (Snake Case)
      const payload: Partial<ApiProduct> = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : undefined,
        is_new: formData.is_new,
        is_flash_sale: formData.is_flash_sale,
        flash_sale_end_time: formData.is_flash_sale && formData.flash_sale_end_time ? new Date(formData.flash_sale_end_time).toISOString() : undefined,
        is_featured: formData.is_featured,
        sales_count: parseInt(formData.sales_count) || 0,
        details: formData.details.split('.').map(s => s.trim()).filter(Boolean),
        video_url: formData.video_url || undefined,
        // Automatically set vendor_id for vendor_admin users
        ...(isVendorAdmin && vendor ? { vendor_id: vendor.id } : {}),
      };

      let productId = editingProduct?.id;

      // 1. Create or Update Product Base
      if (editingProduct) {
        await api.updateProduct(productId!, payload, sessionToken);
      } else {
        const newProduct = await api.createProduct(payload as any, sessionToken);
        productId = newProduct.id;
      }

      // 2. Handle Image Uploads
      // Upload new files
      const uploadedUrls: string[] = [];
      for (const item of newFiles) {
        const res = await api.uploadImage(productId!, item.file, sessionToken);
        uploadedUrls.push(res.image_url);
      }

      // Combine existing kept images + new uploaded images
      // Flatten to ensure we never have nested arrays (fixes db corruption issue)
      const finalImages = [...existingImages, ...uploadedUrls].flat();

      // 3. Update Product with Final Image List
      // If we uploaded anything OR valid images changed, we update the product again
      await api.updateProduct(productId!, { images: finalImages }, sessionToken);

      toast({ title: editingProduct ? "Product updated" : "Product created" });
      setIsDialogOpen(false);
      refetch();
    } catch (error: any) {
      console.error(error);
      toast({ title: "Error", description: error.message || "Something went wrong", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusUpdate = async (productId: string, newStatus: string) => {
    if (!sessionToken) return;
    try {
      await api.updateProductStatus(productId, newStatus, sessionToken);
      toast({
        title: `Product ${newStatus === 'published' ? 'approved' : newStatus}`,
        description: `Status updated to ${newStatus}`
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-semibold">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl">{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              Fill in the details below. You can upload up to 4 images.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="h-10">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Lighting">Lighting</SelectItem>
                    <SelectItem value="Fashion">Fashion</SelectItem>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Beauty">Beauty</SelectItem>
                    <SelectItem value="Jewelry">Jewelry</SelectItem>
                    <SelectItem value="Automotive">Automotive</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="h-10" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="original_price">Original Price (Optional)</Label>
                <Input id="original_price" type="number" step="0.01" value={formData.original_price} onChange={e => setFormData({ ...formData, original_price: e.target.value })} className="h-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Details (separated by full stop '.')</Label>
              <Input id="details" value={formData.details} placeholder="Example: 100% Cotton. Made in Ghana. Water resistant." onChange={e => setFormData({ ...formData, details: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="video_url">Video URL (YouTube/Vimeo)</Label>
              <Input id="video_url" value={formData.video_url} placeholder="e.g. https://www.youtube.com/watch?v=..." onChange={e => setFormData({ ...formData, video_url: e.target.value })} />
              <p className="text-[10px] text-muted-foreground">Optional: Add a link to a product video to show it in the gallery.</p>
            </div>

            {/* Product Flags */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="is_new"
                  checked={formData.is_new}
                  onChange={e => setFormData({ ...formData, is_new: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 accent-primary"
                />
                <Label htmlFor="is_new" className="cursor-pointer font-medium">Mark as New</Label>
              </div>

              {!isVendorAdmin && (
                <>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="is_flash_sale"
                        checked={formData.is_flash_sale}
                        onChange={e => setFormData({ ...formData, is_flash_sale: e.target.checked })}
                        className="w-5 h-5 rounded border-gray-300 accent-primary"
                      />
                      <Label htmlFor="is_flash_sale" className="cursor-pointer font-medium">Flash Sale Item</Label>
                    </div>
                    {formData.is_flash_sale && (
                      <div className="pl-8 animate-in fade-in slide-in-from-top-1">
                        <Label htmlFor="flash_sale_end_time" className="text-xs text-muted-foreground mb-1 block">End Time</Label>
                        <Input
                          id="flash_sale_end_time"
                          type="datetime-local"
                          value={formData.flash_sale_end_time}
                          onChange={e => setFormData({ ...formData, flash_sale_end_time: e.target.value })}
                          className="h-8 text-xs"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300 accent-primary"
                    />
                    <Label htmlFor="is_featured" className="cursor-pointer font-medium">Featured (New Arrivals)</Label>
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label htmlFor="sales_count">Sales Count</Label>
                <Input
                  id="sales_count"
                  type="number"
                  min="0"
                  value={formData.sales_count}
                  onChange={e => setFormData({ ...formData, sales_count: e.target.value })}
                  className="h-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Images ({existingImages.length + newFiles.length}/4)</Label>
              <div className="flex flex-wrap gap-4">
                {existingImages.map((src, idx) => (
                  <div key={`existing-${idx}`} className="relative w-24 h-24 border rounded overflow-hidden group">
                    <img src={src} alt="Existing" className="w-full h-full object-cover" />
                    <button onClick={() => removeExistingImage(idx)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {newFiles.map((item, idx) => (
                  <div key={`new-${idx}`} className="relative w-24 h-24 border rounded overflow-hidden group">
                    <img src={item.preview} alt="New" className="w-full h-full object-cover" />
                    <button onClick={() => removeNewFile(idx)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {(existingImages.length + newFiles.length) < 4 && (
                  <label className="w-24 h-24 border-2 border-dashed rounded flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/50">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-1">Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileSelect} />
                  </label>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : (editingProduct ? "Save Changes" : "Create Product")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>All Products</CardTitle>
              <CardDescription>{products.length} products in catalog</CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
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
                    <TableHead className="w-16">Image</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Badges</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        Loading products...
                      </TableCell>
                    </TableRow>
                  ) : filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground">
                        No products found
                      </TableCell>
                    </TableRow>
                  ) : filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <img
                          src={getValidImageUrl(product.image) || '/placeholder.png'}
                          alt={product.name}
                          className="w-10 h-10 rounded-md object-cover border border-border"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="font-normal">
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold">₵{product.price.toFixed(2)}</span>
                          {product.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through opacity-70">
                              ₵{product.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {(() => {
                          const status = product.status || 'pending';
                          switch (status) {
                            case 'published': return <Badge className="bg-green-500/10 text-green-600 border-green-500/20 capitalize">Published</Badge>;
                            case 'rejected': return <Badge className="bg-red-500/10 text-red-600 border-red-500/20 capitalize">Rejected</Badge>;
                            case 'draft': return <Badge className="bg-slate-500/10 text-slate-600 border-slate-500/20 capitalize">Draft</Badge>;
                            default: return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 capitalize">Pending</Badge>;
                          }
                        })()}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {product.isFlashSale && (
                            <Badge variant="destructive" className="text-[10px] h-4 px-1">Flash</Badge>
                          )}
                          {product.isFeatured && (
                            <Badge className="bg-purple-500 text-[10px] h-4 px-1">Feat</Badge>
                          )}
                          {product.isNew && (
                            <Badge className="bg-green-500 text-[10px] h-4 px-1">New</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {!isVendorAdmin && product.status !== 'published' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              onClick={() => handleStatusUpdate(product.id, 'published')}
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </Button>
                          )}
                          {!isVendorAdmin && product.status !== 'rejected' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={() => handleStatusUpdate(product.id, 'rejected')}
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenEdit(product)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(product.id, product.name)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
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
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="h-48 bg-muted/20" />
                </Card>
              ))
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border border-dashed">
                <p className="text-muted-foreground">No products found</p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden border-border bg-card/50">
                  <CardContent className="p-0">
                    <div className="flex gap-4 p-4">
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-border">
                        <img
                          src={getValidImageUrl(product.image) || '/placeholder.svg'}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-bold text-sm line-clamp-1">{product.name}</h3>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{product.category}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="font-bold text-accent text-sm">₵{product.price.toFixed(2)}</p>
                            {product.originalPrice && (
                              <p className="text-[10px] text-muted-foreground line-through opacity-70">
                                ₵{product.originalPrice.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {product.isFlashSale && (
                            <Badge variant="destructive" className="text-[10px] h-4 px-1">Flash</Badge>
                          )}
                          {product.isFeatured && (
                            <Badge className="bg-purple-500 text-[10px] h-4 px-1">Feat</Badge>
                          )}
                          {product.isNew && (
                            <Badge className="bg-green-500 text-[10px] h-4 px-1">New</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 border-t border-border divide-x divide-border">
                      <Button
                        variant="ghost"
                        className="rounded-none h-10 text-xs gap-2"
                        onClick={() => handleOpenEdit(product)}
                      >
                        <Edit className="w-3.5 h-3.5" />
                        Edit
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="rounded-none h-10 text-xs gap-2">
                            <MoreVertical className="w-3.5 h-3.5" />
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem onClick={() => {
                            navigator.clipboard.writeText(product.id);
                            toast({ title: "ID Copied", description: "Product ID copied to clipboard" });
                          }}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy ID
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDelete(product.id, product.name)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProducts;

