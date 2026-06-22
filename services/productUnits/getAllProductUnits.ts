import AxiosInstance from "@/lib/AxiosInstance";
import { useState } from "react";
import { ProductUnitType } from "@/types/productUnit";

function useGetProductUnits() {
    const [loading, setLoading] = useState(false);
    const [productUnits, setProductUnits] = useState<ProductUnitType[]>([]);
    const [error, setError] = useState<string | null>(null);

    const getAllProductUnits = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await AxiosInstance.get("/api/ProductUnits");
            
            if (response?.status === 200) {
                setProductUnits(response.data);
                return response.data;
            } else {
                throw new Error("Failed to fetch product units");
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
            setError(errorMessage);
            throw errorMessage;
        } finally {
            setLoading(false);
        }
    };

    return { loading, productUnits, error, getAllProductUnits };
}

export default useGetProductUnits;
