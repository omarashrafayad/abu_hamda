import AxiosInstance from "@/lib/AxiosInstance";
import { useState } from "react";
import { SubCategoryType } from "@/types/subcategory";

function useCreateSubCategory() {
    const [loading, setLoading] = useState(false);

    const creatingSubCategory = async (data: SubCategoryType) => {
        setLoading(true);
        try {
            const response = await AxiosInstance.post("/api/SubCategories", data);
            if (response?.status === 200 || response?.status === 201) {
                return true;
            } else {
                throw new Error("Something went wrong");
            }
        } catch (err: any) {
            throw err.response?.data?.message || err.message;
        } finally {
            setLoading(false);
        }
    };

    return { loading, creatingSubCategory };
}

export default useCreateSubCategory;
