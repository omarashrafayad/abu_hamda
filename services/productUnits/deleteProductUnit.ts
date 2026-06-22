import AxiosInstance from "@/lib/AxiosInstance";
import { useState } from "react";

function useDeleteProductUnit() {
    const [loading, setLoading] = useState(false);

    const deleteProductUnit = async (id: number | string) => {
        setLoading(true);
        try {
            const response = await AxiosInstance.delete(`/api/ProductUnits/${id}`);
            
            return response.status === 200 || response.status === 204;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Delete failed";
            throw errorMessage; 
        } finally {
            setLoading(false);
        }
    };

    return { loading, deleteProductUnit };
}

export default useDeleteProductUnit;
