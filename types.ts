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
  address: string;
};

export type Item = {
  id: string;
  name: string;
  quantity: number;
  description: string;
  price: number;
  image_url: string;
  is_available: boolean;
  created_at: string;
};

export type ReservationStatus =
  | "confirmed"
  | "cancelled"
  | "no_show"
  | "completed";

export type Reservation = {
  id: string;
  reservation_date: string;
  start_time: string;
  end_time: string;
  party_size: number;
  guest_name: string;
  guest_phone: string;
  status: ReservationStatus;
  created_at: string;
};

export type FormAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_PHONE"; payload: string }
  | { type: "SET_NOTES"; payload: string }
  | { type: "RESET" };

export type DeliveryAction =
  | { type: "SET_ADDRESS"; payload: string }
  | { type: "SET_COORDINATES"; payload: { lat: number; lng: number } }
  | { type: "RESET" };

export type SubmitAction =
  | { type: "SUBMITTING" }
  | { type: "SUCCESS" }
  | { type: "ERROR"; payload: string }
  | { type: "RESET" };

export type ReservationSettings = {
  readonly max_party_size: number;
  readonly min_party_size: number;
  readonly max_booking_days: number;
};

export type Slot = string;

export type BookingState = {
  readonly date: string;
  readonly partySize: number;
  readonly slots: Slot[];
  readonly selected: string | null;
  readonly guestName: string;
  readonly guestPhone: string;
};

export type BookingAction =
  | { type: "setDate"; payload: string }
  | { type: "setPartySize"; payload: number }
  | { type: "setSlots"; payload: Slot[] }
  | { type: "setSelected"; payload: string | null }
  | { type: "setGuestName"; payload: string }
  | { type: "setGuestPhone"; payload: string }
  | { type: "resetForm" };

export type BookingStatus = {
  readonly loading: boolean;
  readonly error: string;
  readonly success: string;
};

export type UseBookingResult = {
  readonly state: BookingState;
  readonly status: BookingStatus;
  readonly minPartySize: number;
  readonly maxPartySize: number;
  readonly maxBookingDays: number;
  readonly maxBookingDate: string;
  readonly partySizeOptions: number[];
  readonly setDate: (date: string) => void;
  readonly setPartySize: (size: number) => void;
  readonly setSelected: (slot: string | null) => void;
  readonly setGuestName: (name: string) => void;
  readonly setGuestPhone: (phone: string) => void;
  readonly book: () => Promise<void>;
};

export type Status = "idle" | "loading" | "itemAdded";

export type ItemForm = Omit<Item, "id" | "created_at">;

export type MenuItemFormProps = {
  readonly item: Item;
  readonly setIsUpdating: (isUpdating: boolean) => void;
};

export type FormState = {
  readonly description: string;
  readonly imageUrl: string;
  readonly isSaving: boolean;
  readonly isUploadingImage: boolean;
  readonly name: string;
  readonly price: string;
  readonly quantity: string;
};

export type FormMenuItemAction =
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "SET_IMAGE_URL"; payload: string }
  | { type: "SET_IS_SAVING"; payload: boolean }
  | { type: "SET_IS_UPLOADING_IMAGE"; payload: boolean }
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_PRICE"; payload: string }
  | { type: "SET_QUANTITY"; payload: string };

export type AddMenuItemState = {
  isOpen: boolean;
  name: string;
  description: string;
  price: string;
  quantity: string;
  imageUrl: string;
  isSaving: boolean;
  isUploadingImage: boolean;
};

export type AddMenuItemAction =
  | { type: "SET_IS_OPEN"; payload: boolean }
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "SET_PRICE"; payload: string }
  | { type: "SET_QUANTITY"; payload: string }
  | { type: "SET_IMAGE_URL"; payload: string }
  | { type: "SET_IS_SAVING"; payload: boolean }
  | { type: "SET_IS_UPLOADING_IMAGE"; payload: boolean }
  | { type: "RESET" };

export type SettingsForm = {
  open_time: string
  close_time: string
  slot_interval: number
  total_capacity: number
  session_duration: number
  cleaning_buffer: number
  max_party_size: number
  min_party_size: number
  max_booking_days: number
  tax_rate: number
  delivery_fee: number
}