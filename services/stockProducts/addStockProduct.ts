import AxiosInstance from "@/lib/AxiosInstance";
import { useState } from "react";

function useAddStockProduct() {
    const [loading, setLoading] = useState(false);

    const addStockProduct = async (data: {
        productUnitId: number;
        quantity: number;
    }) => {
        setLoading(true);
        try {
            const response = await AxiosInstance.post("/api/StockProducts", data);
            
            return response.status === 200 || response.status === 201;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to add stock product";
            throw errorMessage;
        } finally {
            setLoading(false);
        }
    };

    return { loading, addStockProduct };
}

export default useAddStockProduct;
