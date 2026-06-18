import { useState } from "react";
import { SubCategoryType } from "@/types/subcategory";
import AxiosInstance from "@/lib/AxiosInstance";

function useGetSubCategoryById() {
    const [loading, setLoading] = useState(true);
    const [subcategory, setSubcategory] = useState<SubCategoryType>({
        name: "",
        categoryId: ""
    });

    const gettingSubCategoryById = async (id: string | string[] | undefined) => {
       await AxiosInstance.get(`/api/SubCategories/${id}`).then((response) => {
           if (response.status === 200 || response.data !== null) {
               setSubcategory(response.data);
           }
           if (response.status !== 200 || response.data.errors || response.data.title == "One or more validation errors occurred.") {
               throw new Error(response.data.title || "Something went wrong");
           }
       }).catch((err) => {
           return err.response?.data?.message || err.message;
       }).finally(() => {
           setLoading(false);
       });
    };

    return { subcategory, loading, gettingSubCategoryById };
}

export default useGetSubCategoryById;
