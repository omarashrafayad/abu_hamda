import AxiosInstance from "@/lib/AxiosInstance";
import { useState } from "react";
import { StockProductType } from "@/types/stockProduct";

function useGetStockProductById() {
    const [loading, setLoading] = useState(false);

    const getStockProductById = async (id: string | number) => {
        setLoading(true);
        try {
            const response = await AxiosInstance.get(`/api/StockProducts/${id}`);
            
            if (response?.status === 200) {
                return response.data as StockProductType;
            } else {
                throw new Error("Failed to fetch stock product");
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
            throw errorMessage;
        } finally {
            setLoading(false);
        }
    };

    return { loading, getStockProductById };
}

export default useGetStockProductById;
