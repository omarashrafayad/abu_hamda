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
import useAddStockProduct from "@/services/stockProducts/addStockProduct";
import useGetProductUnits from "@/services/productUnits/getAllProductUnits";
import { Loader2, Upload } from "lucide-react";
import { useTranslations } from "next-intl";

const AddStockProductPage = () => {
  const { addStockProduct, loading: addingLoading } = useAddStockProduct();
  const { productUnits, loading: unitsLoading, getAllProductUnits } = useGetProductUnits();
  
  const router = useRouter();
  const t = useTranslations("stockProducts");

  const [productUnitId, setProductUnitId] = useState("");
  const [productUnitSearch, setProductUnitSearch] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    getAllProductUnits();
  }, []);

  const filteredProductUnits = productUnits?.filter((pu: any) =>
    (pu.productName || "").toLowerCase().includes(productUnitSearch.toLowerCase()) ||
    (pu.unitName || "").toLowerCase().includes(productUnitSearch.toLowerCase())
  ) || [];

  const handleAddStockProductSubmit = async () => {
    if (!productUnitId || !quantity) {
      toast.error(t("validationError"), {
        description: t("fill_required_fields")
      });
      return;
    }

    const payload = {
      productUnitId: Number(productUnitId),
      quantity: Number(quantity),
    };

    try {
      const success = await addStockProduct(payload);
      if (success) {
        toast.success(t("successAdd"));
        setTimeout(() => {
          router.push("/dashboard/stock-products");
        }, 1000);
      }
    } catch (error: any) {
      toast.error(t("errorAdd"), {
        description: typeof error === "string" ? error : error.message,
      });
    }
  };

  if (unitsLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-4 rounded-lg">
      <div className="col-span-12">
        <Card>
          <CardHeader className="border-b border-solid border-default-200 mb-6">
            <CardTitle>{t("stock_information")}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Product Unit Selector */}
            <div className="flex items-center flex-wrap gap-2">
              <Label className="w-[180px] flex-none text-sm font-medium" htmlFor="productUnitId">
                {t("productUnit")}
              </Label>
              <Select onValueChange={(value) => setProductUnitId(value)}>
                <SelectTrigger className="flex-1 min-w-[300px]">
                  <SelectValue placeholder={t("productUnit")} />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-1">
                    <Input
                      placeholder={t("searchPlaceholder")}
                      onChange={(e) => setProductUnitSearch(e.target.value)}
                    />
                  </div>
                  <SelectGroup className="max-h-[300px] overflow-y-auto">
                    {filteredProductUnits.map((pu: any) => (
                      <SelectItem key={pu.id} value={pu.id.toString()}>
                        {pu.productName} ({pu.unitName})
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div className="flex items-center flex-wrap gap-2">
              <Label className="w-[180px] flex-none text-sm font-medium" htmlFor="quantity">
                {t("quantity")}
              </Label>
              <Input
                id="quantity"
                type="number"
                step="any"
                className="flex-1 min-w-[300px]"
                placeholder={t("quantity")}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-12 flex justify-center mt-4">
        <Button
          onClick={handleAddStockProductSubmit}
          disabled={addingLoading}
          className="w-full max-w-[200px] gap-2"
        >
          {addingLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {t("add_stock")}
        </Button>
      </div>
    </div>
  );
};

export default AddStockProductPage;
