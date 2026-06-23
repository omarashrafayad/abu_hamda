import AxiosInstance from "@/lib/AxiosInstance";
import { useState } from "react";
import { StockProductType } from "@/types/stockProduct";

function useGetStockProducts() {
    const [loading, setLoading] = useState(false);
    const [stockProducts, setStockProducts] = useState<StockProductType[]>([]);
    const [error, setError] = useState<string | null>(null);

    const getAllStockProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await AxiosInstance.get("/api/StockProducts");
            
            if (response?.status === 200) {
                setStockProducts(response.data);
                return response.data;
            } else {
                throw new Error("Failed to fetch stock products");
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
            setError(errorMessage);
            throw errorMessage;
        } finally {
            setLoading(false);
        }
    };

    return { loading, stockProducts, error, getAllStockProducts };
}

export default useGetStockProducts;
