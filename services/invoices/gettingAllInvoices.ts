import { useState, useCallback } from "react";
import AxiosInstance from "@/lib/AxiosInstance";

function useGettingAllInvoices() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);

  const gettingAllInvoices = useCallback(async () => {
    setLoading(true);
    setError(null);
    const timestamp = new Date().getTime();
    await AxiosInstance.get(`/api/Invoices?t=${timestamp}`)
      .then((res) => {
        if (res.status === 200 || res.status === 201 || !res.data.errors) {
          setInvoices(res.data);
        } else {
          const firstKey = Object.keys(res.data.errors)[0];
          const firstMessage = res.data.errors[firstKey][0];
          setError(`${firstKey}: ${firstMessage}`);
        }
      })
      .catch((err) => {
        const apiErrors = err?.response?.data?.errors;
        if (apiErrors && typeof apiErrors === "object") {
          const firstKey = Object.keys(apiErrors)[0];
          const firstMessage = apiErrors[firstKey][0];
          setError(`${firstKey}: ${firstMessage}`);
        } else {
          setError(err?.message || "An unexpected error occurred.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    loading,
    error,
    invoices,
    gettingAllInvoices,
  };
}

export default useGettingAllInvoices;
