export interface Vendor {
    id: string;
    name: string;
    slug: string;
    description?: string;
    logo_url?: string;
    banner_url?: string;
    contact_email?: string;
    contact_phone?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
    };
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface VendorCreate {
    name: string;
    description?: string;
    logo_url?: string;
    banner_url?: string;
    contact_email?: string;
    contact_phone?: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
    };
    is_active?: boolean;
}

export interface VendorUpdate extends Partial<VendorCreate> { }

export interface VendorAdmin {
    vendor_id: string;
    user_id: string;
    created_at: string;
}
