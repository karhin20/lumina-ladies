import { useState } from 'react';
import { getValidImageUrl } from '@/lib/utils';
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

import { Plus, Search, Edit2, Trash2, Upload, X } from 'lucide-react';
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
  const { data: allProducts = [], isLoading, refetch } = useProducts();

  // Filter products by vendor for vendor_admin users
  const products = isVendorAdmin && vendor
    ? allProducts.filter(p => (p as any).vendor_id === vendor.id)
    : allProducts;

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
    is_featured: false,
    sales_count: '0',
    details: '', // Comma separated
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
      is_featured: false, sales_count: '0', details: ''
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
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      original_price: product.originalPrice?.toString() || '',
      is_new: product.isNew || false,
      is_flash_sale: product.isFlashSale || false,
      is_featured: product.isFeatured || false,
      sales_count: product.salesCount?.toString() || '0',
      details: (product.details || []).join(', '),
    });
    // Ensure we handle both single image_url (as image) and images array
    const images = product.images && product.images.length > 0
      ? product.images
      : (product.image ? [product.image] : []);

    setExistingImages(images);
    setNewFiles([]);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!sessionToken) return;
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.deleteProduct(id, sessionToken);
      toast({ title: 'Product deleted' });
      refetch();
    } catch (error: any) {
      toast({ title: 'Failed to delete', description: error.message, variant: 'destructive' });
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

  const removeExistingImage = (index: number) => {
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
        is_featured: formData.is_featured,
        sales_count: parseInt(formData.sales_count) || 0,
        details: formData.details.split(',').map(s => s.trim()).filter(Boolean),
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              Fill in the details below. You can upload up to 4 images.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Fashion">Fashion</SelectItem>
                    <SelectItem value="Home">Home</SelectItem>
                    <SelectItem value="Beauty">Beauty</SelectItem>
                    <SelectItem value="Automotive">Automotive</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input id="price" type="number" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="original_price">Original Price (Optional)</Label>
                <Input id="original_price" type="number" step="0.01" value={formData.original_price} onChange={e => setFormData({ ...formData, original_price: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="details">Details (comma separated)</Label>
              <Input id="details" value={formData.details} onChange={e => setFormData({ ...formData, details: e.target.value })} />
            </div>

            {/* Product Flags */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_new"
                  checked={formData.is_new}
                  onChange={e => setFormData({ ...formData, is_new: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor="is_new" className="cursor-pointer">Mark as New</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_flash_sale"
                  checked={formData.is_flash_sale}
                  onChange={e => setFormData({ ...formData, is_flash_sale: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor="is_flash_sale" className="cursor-pointer">Flash Sale Item</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={e => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor="is_featured" className="cursor-pointer">Featured (New Arrivals)</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sales_count">Sales Count</Label>
                <Input
                  id="sales_count"
                  type="number"
                  min="0"
                  value={formData.sales_count}
                  onChange={e => setFormData({ ...formData, sales_count: e.target.value })}
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
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sales</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <div className="p-8 text-center text-muted-foreground">Loading products...</div>
                ) : filteredProducts.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">No products match your search</div>
                ) : filteredProducts.map((product: any) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={getValidImageUrl(product.images || product.image_url || product.image) || '/placeholder.svg'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {product.description.substring(0, 50)}...
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">₵{product.price.toFixed(2)}</p>
                        {(product.originalPrice || product.original_price) && (
                          <p className="text-sm text-muted-foreground line-through">
                            ₵{(product.originalPrice || product.original_price).toFixed(2)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {product.isFlashSale && (
                          <Badge variant="destructive" className="text-xs">Flash Sale</Badge>
                        )}
                        {product.isFeatured && (
                          <Badge className="bg-purple-500 text-xs">Featured</Badge>
                        )}
                        {product.isNew && (
                          <Badge className="bg-green-500 text-xs">New</Badge>
                        )}
                        {!product.isFlashSale && !product.isFeatured && !product.isNew && (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{product.salesCount || 0}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEdit(product)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProducts;
