export interface WishlistHeader {
  title: string;
}

export interface Wishlist extends WishlistHeader {
  id: string;
  items?: WishlistItem[];
  itemsCount?: number;
}

export interface WishlistItem {
  sku: string;
  id: string;
  creationDate: number;
  desiredQuantity: {
    value: number;
    unit?: string;
  };
  purchasedQuantity?: {
    value: number;
    unit: string;
  };
}
