import { useState } from "react";
import AxiosInstance from "@/lib/AxiosInstance";
import { OrderStatus } from "@/enum";

function useUpdateOrderStatus() {
  const [loading, setLoading] = useState(false);

  const updateOrderStatus = async (
    orderId: string | number,
    status: OrderStatus
  ): Promise<{ success: boolean; error?: string }> => {
    setLoading(true);

    try {
      const url = `/api/Orders/${orderId}/status`;
      const response = await AxiosInstance.put(url, { status });

      if (response.status < 200 || response.status >= 300) {
        throw new Error("Failed to update order status");
      }

      return { success: true };
    } catch (error: any) {
      console.error("CHANGE STATUS ERROR:", error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || "Unknown error" 
      };
    } finally {
      setLoading(false);
    }
  };

  return { updateOrderStatus, loading };
}

export default useUpdateOrderStatus;
