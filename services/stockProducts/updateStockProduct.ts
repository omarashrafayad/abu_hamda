import AxiosInstance from "@/lib/AxiosInstance";
import { useState } from "react";

function useUpdateStockProduct() {
    const [loading, setLoading] = useState(false);

    const updateStockProduct = async (
        id: string | number,
        data: {
            productUnitId: number;
            quantity: number;
        }
    ) => {
        setLoading(true);
        try {
            const response = await AxiosInstance.put(`/api/StockProducts/${id}`, data);
            
            return response.status === 200 || response.status === 204;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Update failed";
            throw errorMessage;
        } finally {
            setLoading(false);
        }
    };

    return { loading, updateStockProduct };
}

export default useUpdateStockProduct;
