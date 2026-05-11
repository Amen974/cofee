import { create } from "zustand";
import { createClient } from "../supabase/client";

type IsOpenState = {
  isOpen: boolean;
  setIsOpen: () => Promise<void>;
  loading: boolean;
  fetchIsOpen: () => Promise<void>;
};

export const useIsOpen = create<IsOpenState>((set) => ({
  isOpen: true,
  loading: true,
  fetchIsOpen: async () => {
    try {
      const { data, error } = await createClient()
        .from("restaurant_settings")
        .select("isopen")
        .maybeSingle();
      if (error) {
        console.error("Error fetching isOpen:", error);
        set({ loading: false });
        return;
      }
      set({ isOpen: data?.isopen ?? true, loading: false });
    } catch (error) {
      console.error("Error fetching isOpen:", error);
      set({ loading: false });
    }
  },
  setIsOpen: async () => {
    const currentValue = useIsOpen.getState().isOpen;
    const newValue = !currentValue;

    set({ isOpen: newValue });

    try {
      const { error } = await createClient()
        .from("restaurant_settings")
        .update({ isopen: newValue })
        .eq("id", 1);

      if (error) {
        console.error("Error setting isOpen:", error);
        set({ isOpen: currentValue });
      }
    } catch (error) {
      console.error("Error setting isOpen:", error);
      set({ isOpen: currentValue });
    }
  },
}));
