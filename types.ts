export type Orders = {
  id: string;
  created_at: string;
  customer_name: string;
  phone: number;
  lat: number;
  lng: number;
  status: string;
  notes: string;
  items: Item[];
  total_price: number;
  address: string
}

export type Item = {
  id: string;
  name: string;
  quantity: number
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
  created_at: string;
}

export type FormAction =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_PHONE'; payload: string }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'RESET' }

export type DeliveryAction =
  | { type: 'SET_ADDRESS'; payload: string }
  | { type: 'SET_COORDINATES'; payload: { lat: number; lng: number } }
  | { type: 'RESET' }

export type SubmitAction =
  | { type: 'SUBMITTING' }
  | { type: 'SUCCESS' }
  | { type: 'ERROR'; payload: string }
  | { type: 'RESET' }