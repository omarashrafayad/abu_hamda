import AxiosInstance from "@/lib/AxiosInstance";
import { useState } from "react";
import { UnitType } from "@/types/unit";

function useGetUnits() {
    const [loading, setLoading] = useState(false);
    const [units, setUnits] = useState<UnitType[]>([]);
    const [error, setError] = useState<string | null>(null);

    const getAllUnits = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await AxiosInstance.get("/api/Units");
            
            if (response?.status === 200) {
                setUnits(response.data);
                return response.data;
            } else {
                throw new Error("Failed to fetch units");
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
            setError(errorMessage);
            throw errorMessage;
        } finally {
            setLoading(false);
        }
    };

    return { loading, units, error, getAllUnits };
}

export default useGetUnits;
