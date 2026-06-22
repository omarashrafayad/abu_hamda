import AxiosInstance from "@/lib/AxiosInstance";
import { useState } from "react";

function useUpdateUnit() {
    const [loading, setLoading] = useState(false);

    const updateUnit = async (id: string | number, data: { name: string }) => {
        setLoading(true);
        try {
            const response = await AxiosInstance.put(`/api/Units/${id}`, data);
            
            return response.status === 200 || response.status === 204;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Update failed";
            throw errorMessage;
        } finally {
            setLoading(false);
        }
    };

    return { loading, updateUnit };
}

export default useUpdateUnit;
