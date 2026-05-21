export type Orders = {
  id: string;
  created_at: string;
  customer_name: string;
  phone: number;
  lat: number;
  lng: number;
  status: string;
  notes: string;
  items: Menu[];
  total_price: number;
  address: string
}

export type Menu = {
  id: string;
  name: string;
  quantity: number
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
  created_at: string;
}