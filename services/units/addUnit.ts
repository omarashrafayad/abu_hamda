import AxiosInstance from "@/lib/AxiosInstance";
import { useState } from "react";

function useAddUnit() {
    const [loading, setLoading] = useState(false);

    const addUnit = async (data: { name: string }) => {
        setLoading(true);
        try {
            const response = await AxiosInstance.post("/api/Units", data);
            
            return response.status === 200 || response.status === 201;
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Failed to add unit";
            throw errorMessage;
        } finally {
            setLoading(false);
        }
    };

    return { loading, addUnit };
}

export default useAddUnit;
