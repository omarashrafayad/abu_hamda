import { useState, useCallback } from "react";
import AxiosInstance from "@/lib/AxiosInstance";

export interface OrderDetailsItem {
  id: number;
  productId: number;
  productName: string;
  productUnitId: number;
  unitId: number;
  unitName: string;
  quantity: number;
  price: number;
  subTotal: number;
}

export interface OrderDetailsData {
  id: number;
  couponId: number | null;
  couponCode: string | null;
  userId: string;
  orderDate: string;
  totalAmount: number;
  discountAmount: number;
  status: string;
  items: OrderDetailsItem[];
}

function useGetOrderDetails() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderDetailsData | null>(null);

  const getOrderDetails = useCallback(async (id: string | number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await AxiosInstance.get(`/api/Orders/get-order-details/${id}`);
      if (res.status === 200 || res.status === 201) {
        setOrder(res.data);
      } else {
        setError("Failed to fetch order details.");
      }
    } catch (err: any) {
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors && typeof apiErrors === "object") {
        const firstKey = Object.keys(apiErrors)[0];
        const firstMessage = apiErrors[firstKey][0];
        setError(`${firstKey}: ${firstMessage}`);
      } else {
        setError(err?.response?.data?.message || err?.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    order,
    getOrderDetails,
  };
}

export default useGetOrderDetails;
