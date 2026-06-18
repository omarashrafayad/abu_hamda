import { useState } from "react";
import { SubCategoryType } from "@/types/subcategory";
import AxiosInstance from "@/lib/AxiosInstance";

function useUpdateSubCategoryById() {
    const [loading, setLoading] = useState(false);

    const updatingSubCategoryById = async (id: string | string[] | undefined, updatedData: SubCategoryType): Promise<{ success: boolean; error?: string }> => {
        setLoading(true);

        try {
            const response = await AxiosInstance.put(`/api/SubCategories/${id}`, updatedData);

            if (response.status === 200 || response.status === 204 || response.status !== 500) {
                return { success: true };
            } else {
                throw new Error("Something went wrong");
            }
        } catch (err: any) {
            return {
                success: false,
                error: err.response?.data?.message || err.message,
            };
        } finally {
            setLoading(false);
        }
    };

    return { loading, updatingSubCategoryById };
}

export default useUpdateSubCategoryById;
