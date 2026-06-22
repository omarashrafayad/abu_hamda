import AxiosInstance from "@/lib/AxiosInstance";
import { useState } from "react";

function useAddProductUnit() {
    const [loading, setLoading] = useState(false);

    const addProductUnit = async (data: {
        productId: number;
        unitId: number;
        conversionRate: number;
        price: number;
    }) => {
        setLoading(true);
        try {
            const response = await AxiosInstance.post("/api/ProductUnits", data);
            
            return response.status === 200 || response.status === 201;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to add product unit";
            throw errorMessage;
        } finally {
            setLoading(false);
        }
    };

    return { loading, addProductUnit };
}

export default useAddProductUnit;
