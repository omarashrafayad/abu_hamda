"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import GetCategories from "@/services/categories/getCategories";
import useCreateSubCategory from "@/services/subcategories/CreateSubCategory";
import { Loader2, Upload } from "lucide-react"; 
import { useTranslations } from "next-intl";

const AddSubCategory = () => {
  const { creatingSubCategory, loading } = useCreateSubCategory();
  const { loading: categoriesLoading, data: categoriesData, gettingAllCategories } = GetCategories();
  const router = useRouter();
  const t = useTranslations("subcategories");

  const [Name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categorySearch, setCategorySearch] = useState("");
  const [filteredCategories, setFilteredCategories] = useState<any[]>([]);

  useEffect(() => {
    gettingAllCategories();
  }, []);

  useEffect(() => {
    if (categoriesData) {
      const filtered = categoriesData.filter((category: any) =>
        category.name?.toLowerCase().includes(categorySearch.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  }, [categorySearch, categoriesData]);

  const addSubCategory = async () => {
    if (!Name.trim()) {
      toast.error(t("validationError"), { description: t("subcategory_name_required") });
      return;
    }
    if (!categoryId) {
      toast.error(t("validationError"), { description: t("category_required") });
      return;
    }

    try {
      const success = await creatingSubCategory({
        name: Name,
        categoryId: Number(categoryId),
      });
      
      if (success) {
        toast.success(t("subcategory_added"), {
          description: t("subcategory_added_success"),
        });
        setTimeout(() => {
          router.push("/dashboard/subcategories");
        }, 1000);
      }
    } catch (error: any) {
      toast.error(t("failed_to_add_subcategory"));
    }
  };

  if (categoriesLoading) {
    return (
      <div className="h-[200px] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 rounded-lg">
      <div className="col-span-12">
        <Card>
          <CardHeader className="border-b border-solid border-default-200 mb-6">
            <CardTitle>{t("subcategory_Information")} </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-center flex-wrap gap-2">
              <Label className="w-[180px] flex-none text-sm font-medium" htmlFor="subcategoryName">
                {t("subcategory_name")}
              </Label>
              <Input
                id="subcategoryName"
                className="flex-1 min-w-[300px]"
                placeholder={t("subcategory_name")}
                value={Name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <Label className="w-[180px] flex-none text-sm font-medium" htmlFor="categorySelect">
                {t("category_name")}
              </Label>
              <div className="flex-1 min-w-[300px]">
                <Select onValueChange={(value) => setCategoryId(value)} value={categoryId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("category_name")} />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1">
                      <Input 
                        placeholder="Search category..." 
                        value={categorySearch}
                        onChange={(e) => setCategorySearch(e.target.value)} 
                      />
                    </div>
                    <SelectGroup>
                      {filteredCategories.map((category: any) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-12 flex justify-center mt-4">
        <Button onClick={addSubCategory} disabled={loading} className="w-full max-w-[200px] gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Upload className="w-4 h-4"/>}
          {t("add_subcategory")}
        </Button>
      </div>
    </div>
  );
};

export default AddSubCategory;
