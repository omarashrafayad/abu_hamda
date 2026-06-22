import AxiosInstance from "@/lib/AxiosInstance";
import { useState } from "react";
import { ProductUnitType } from "@/types/productUnit";

function useGetProductUnitById() {
    const [loading, setLoading] = useState(false);

    const getProductUnitById = async (id: string | number) => {
        setLoading(true);
        try {
            const response = await AxiosInstance.get(`/api/ProductUnits/${id}`);
            
            if (response?.status === 200) {
                return response.data as ProductUnitType;
            } else {
                throw new Error("Failed to fetch product unit");
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
            throw errorMessage;
        } finally {
            setLoading(false);
        }
    };

    return { loading, getProductUnitById };
}

export default useGetProductUnitById;
