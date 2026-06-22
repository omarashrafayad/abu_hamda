import AxiosInstance from "@/lib/AxiosInstance";
import { useState } from "react";
import { UnitType } from "@/types/unit";

function useGetUnitById() {
    const [loading, setLoading] = useState(false);

    const getUnitById = async (id: string | number) => {
        setLoading(true);
        try {
            const response = await AxiosInstance.get(`/api/Units/${id}`);
            
            if (response?.status === 200) {
                return response.data as UnitType;
            } else {
                throw new Error("Failed to fetch unit");
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || "Something went wrong";
            throw errorMessage;
        } finally {
            setLoading(false);
        }
    };

    return { loading, getUnitById };
}

export default useGetUnitById;
