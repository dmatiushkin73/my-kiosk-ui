export interface Banner {
    type: string;
    id: number;
    image: string;
}
  
export interface Slider {
    type: string;
    title: string;
    ids: number[];
}
  
export interface Collection {
    id: number;
    products: number[];
}
  
export interface Section {
    type: string;
    description: {
      type: string;
      id?: number;
      imageId?: number;
      imageUrl?: string;
      title?: string;
      ids?: number[],
      items?: {
        id: number;
        name: string;
        image: string;
      }[];
    };
}
  
export interface ProfileData {
    id: number;
    name?: string;
    sections: Section[];
    collections: Collection[];
    products: number[];
}
  
export interface UiModel {
    brand: {
        logoId: number;
        name: string;
    },
    last_updated: number;
    profiles: {
      [key: string]: ProfileData;
    };
}

export interface ProfileDetails {
    id: number;
    leftBanner?: Banner;
    rightBanner?: Banner;
    topSlider?: Slider;
    bottomSlider?: Slider;
    collections: Collection[];
    products: number[];
}
  
export interface DeviceConfig {
    customerId: string;
    deviceId: string;
}
  
export interface BrandColor {
    accent: string;
    contrast: string;
    forWhiteBg: string;
}
  
export interface Contact {
    phone: string;
    department: string;
}

export interface Brand {
    customerName: string;
    showCustomerName: boolean;
    logoId: number;
    logoUrl: string;
    color: BrandColor;
    contacts: Contact[];
}

export interface BrandDetails {
    name: string;
    showName: boolean;
    logo: string;
}

export interface CollectionData {
    id: number;
    name: string;
    image: string;
}
  
export interface ProductOption {
    name: string;
    value: string;
}

export interface ProductVariantData {
    id: number;
    price: number;
    comparePrice: number;
    priceFormatted: string;
    comparePriceFormatted: string;
    image: string;
    available: number;
    options: ProductOption[];
}
  
export interface ProductData {
    id: number;
    name: string;
    description: string;
    images: string[];
    variants: ProductVariantData[];
}
  
export interface CartData {
    id: number;
    productVariantName: string;
    image: string;
    priceFormatted: string;
    price: number;
    quantity: number;
    totalPrice: string;
    available: number;
    incEnabled: boolean;
    decEnabled: boolean;
}

export interface CartItem {
    variantId: number;
    amount: number;
}

export interface ResponseResult {
    message: string;
}

export interface VariantUpdate {
    variantId: number;
    available: number;
}

export interface TransactionIdResult {
    transactionId: string;
}