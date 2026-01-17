import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';

const AdminSettings = () => {
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: 'Settings saved',
      description: 'This is a demo. In production, settings would be persisted.',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl lg:text-3xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Manage your store settings</p>
      </div>

      {/* Demo Notice */}
      <Card className="border-accent/50 bg-accent/5">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-foreground">Demo Mode</p>
            <p className="text-sm text-muted-foreground">
              This is a demo version. Settings changes won't persist. Connect a backend for full functionality.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Store Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Store Information</CardTitle>
          <CardDescription>Basic information about your store</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input id="storeName" defaultValue="LumiGh" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Contact Email</Label>
              <Input id="email" type="email" defaultValue="support@lumigh.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Contact Phone</Label>
              <Input id="phone" defaultValue="+233 20 123 4567" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Input id="currency" defaultValue="GHS (₵)" disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Configure email and push notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">New Order Notifications</p>
              <p className="text-sm text-muted-foreground">Receive alerts when a new order is placed</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Low Stock Alerts</p>
              <p className="text-sm text-muted-foreground">Get notified when product stock is low</p>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Customer Reviews</p>
              <p className="text-sm text-muted-foreground">Receive notifications for new customer reviews</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Shipping Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Shipping</CardTitle>
          <CardDescription>Configure shipping options and rates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="freeShipping">Free Shipping Threshold (₵)</Label>
              <Input id="freeShipping" type="number" defaultValue="200" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="standardRate">Standard Shipping Rate (₵)</Label>
              <Input id="standardRate" type="number" defaultValue="15" />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Enable Express Shipping</p>
              <p className="text-sm text-muted-foreground">Offer faster delivery options</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Save Changes</Button>
      </div>
    </div>
  );
};

export default AdminSettings;

