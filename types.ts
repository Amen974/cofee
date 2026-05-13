export type Orders = {
  id: string;
  created_at: string;
  customer_name: string;
  phone: number;
  lat: number;
  lng: number;
  status: string;
  notes: string;
  items: string[];
  total_price: number;
}

export type Menu = {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
  created_at: string;
}