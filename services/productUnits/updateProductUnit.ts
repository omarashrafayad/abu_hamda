import AxiosInstance from "@/lib/AxiosInstance";
import { useState } from "react";

function useUpdateProductUnit() {
    const [loading, setLoading] = useState(false);

    const updateProductUnit = async (
        id: string | number,
        data: {
            productId: number;
            unitId: number;
            conversionRate: number;
            price: number;
        }
    ) => {
        setLoading(true);
        try {
            const response = await AxiosInstance.put(`/api/ProductUnits/${id}`, data);
            
            return response.status === 200 || response.status === 204;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Update failed";
            throw errorMessage;
        } finally {
            setLoading(false);
        }
    };

    return { loading, updateProductUnit };
}

export default useUpdateProductUnit;
