import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Orders } from "@/types";

const supabase = createClient();

export type Filter = "pending" | "confirmed" | "cancelled";
export const STATUSES: Filter[] = ["pending", "confirmed", "cancelled"];

export interface UseOrdersResult {
  STATUSES: Filter[];
  orders: Orders[];
  loading: boolean;
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  filteredOrders: Orders[];
  updateStatus: (id: string, status: Filter) => Promise<void>;
}

export const useOrders = (): UseOrdersResult => {
  const [orders, setOrders] = useState<Orders[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<Filter>("pending");
  const [search, setSearch] = useState("")

  const updateStatus = async (id: string, status: Filter): Promise<void> => {
    let previous: string | undefined;

    setOrders((prev) => {
      previous = prev.find((o) => o.id === id)?.status;
      return prev.map((o) => (o.id === id ? { ...o, status } : o));
    });

    try {
      const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    } catch (err) {
      console.error(err);
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: previous! } : o)),
      );
    }
  };

  useEffect(() => {
    const fetchOrders = async (): Promise<void> => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setOrders([]);
      } else {
        setOrders(data ?? []);
      }

      setLoading(false);
    };

    fetchOrders();

    const channel = supabase
      .channel("orders-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setOrders((prev) => [payload.new as Orders, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setOrders((prev) =>
              prev.map((o) =>
                o.id === payload.new.id ? (payload.new as Orders) : o,
              ),
            );
          } else if (payload.eventType === "DELETE") {
            setOrders((prev) => prev.filter((o) => o.id !== payload.old.id));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredOrders = useMemo(() => {
    const byStatus = orders.filter((order) => order.status === filter);
    if (!search) return byStatus;
    const q = search.toLowerCase();
    return byStatus.filter((o) =>
      o.customer_name.toLowerCase().includes(q) ||
      String(o.phone).includes(q) ||
      o.id.toLowerCase().includes(q),
    );
  }, [orders, filter, search]);

  return {
    STATUSES,
    orders,
    loading,
    filter,
    setFilter,
    search,
    setSearch,
    filteredOrders,
    updateStatus,
  };
};
