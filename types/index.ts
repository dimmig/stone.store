export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrls: string[];
  imageFilenames: string[];
  sizes: string[];
  colors: string[];
  category: string;
  stockQuantity: number;
  discount: number;
  rating: number;
  createdAt: Date;
  wishlistItems: WishlistItem[];
  reviews?: Review[];
  material?: string;
  careInstructions?: string;
  origin?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string;
  products: Product[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrls: string[];
    stockQuantity: number;
  };
}

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  id: string;
  userId: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  shippingAddressId: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  product: {
    id: string;
    name: string;
    price: number;
    imageUrls: string[];
  };
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  productId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string;
  };
} 