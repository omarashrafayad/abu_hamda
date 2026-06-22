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
import useAddProductUnit from "@/services/productUnits/addProductUnit";
import useGettingAllProducts from "@/services/products/gettingAllProducts";
import useGetUnits from "@/services/units/getAllUnits";
import { Loader2, Upload } from "lucide-react";
import { useTranslations } from "next-intl";

const AddProductUnitPage = () => {
  const { addProductUnit, loading: addingLoading } = useAddProductUnit();
  const { products, loading: productsLoading, getAllProducts } = useGettingAllProducts();
  const { units, loading: unitsLoading, getAllUnits } = useGetUnits();
  
  const router = useRouter();
  const t = useTranslations("productUnits");

  const [productId, setProductId] = useState("");
  const [productSearch, setProductSearch] = useState("");

  const [unitId, setUnitId] = useState("");
  const [unitSearch, setUnitSearch] = useState("");

  const [conversionRate, setConversionRate] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    getAllProducts("false", 1, 1000, "");
    getAllUnits();
  }, []);

  const filteredProducts = products?.filter((prod: any) =>
    (prod.name || "").toLowerCase().includes(productSearch.toLowerCase()) ||
    (prod.productName || "").toLowerCase().includes(productSearch.toLowerCase())
  ) || [];

  const filteredUnits = units?.filter((unit: any) =>
    (unit.name || "").toLowerCase().includes(unitSearch.toLowerCase())
  ) || [];

  const handleAddProductUnitSubmit = async () => {
    if (!productId || !unitId || !conversionRate || !price) {
      toast.error(t("validationError"), {
        description: t("fill_required_fields")
      });
      return;
    }

    const payload = {
      productId: Number(productId),
      unitId: Number(unitId),
      conversionRate: Number(conversionRate),
      price: Number(price),
    };

    try {
      const success = await addProductUnit(payload);
      if (success) {
        toast.success(t("successAdd"));
        setTimeout(() => {
          router.push("/dashboard/product-units");
        }, 1000);
      }
    } catch (error: any) {
      toast.error(t("errorAdd"), {
        description: typeof error === "string" ? error : error.message,
      });
    }
  };

  const isDataLoading = productsLoading || unitsLoading;

  if (isDataLoading) {
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
            <CardTitle>{t("unit_information")}</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Product Selector */}
            <div className="flex items-center flex-wrap gap-2">
              <Label className="w-[180px] flex-none text-sm font-medium" htmlFor="productId">
                {t("productName")}
              </Label>
              <Select onValueChange={(value) => setProductId(value)}>
                <SelectTrigger className="flex-1 min-w-[300px]">
                  <SelectValue placeholder={t("productName")} />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-1">
                    <Input
                      placeholder={t("searchPlaceholder")}
                      onChange={(e) => setProductSearch(e.target.value)}
                    />
                  </div>
                  <SelectGroup className="max-h-[300px] overflow-y-auto">
                    {filteredProducts.map((prod: any) => (
                      <SelectItem key={prod.id} value={prod.id.toString()}>
                        {prod.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Unit Selector */}
            <div className="flex items-center flex-wrap gap-2">
              <Label className="w-[180px] flex-none text-sm font-medium" htmlFor="unitId">
                {t("unitName")}
              </Label>
              <Select onValueChange={(value) => setUnitId(value)}>
                <SelectTrigger className="flex-1 min-w-[300px]">
                  <SelectValue placeholder={t("unitName")} />
                </SelectTrigger>
                <SelectContent>
                  <div className="px-2 py-1">
                    <Input
                      placeholder={t("searchPlaceholder")}
                      onChange={(e) => setUnitSearch(e.target.value)}
                    />
                  </div>
                  <SelectGroup className="max-h-[300px] overflow-y-auto">
                    {filteredUnits.map((unit: any) => (
                      <SelectItem key={unit.id} value={unit.id.toString()}>
                        {unit.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Conversion Rate */}
            <div className="flex items-center flex-wrap gap-2">
              <Label className="w-[180px] flex-none text-sm font-medium" htmlFor="conversionRate">
                {t("conversionRate")}
              </Label>
              <Input
                id="conversionRate"
                type="number"
                step="any"
                className="flex-1 min-w-[300px]"
                placeholder={t("conversionRate")}
                value={conversionRate}
                onChange={(e) => setConversionRate(e.target.value)}
              />
            </div>

            {/* Price */}
            <div className="flex items-center flex-wrap gap-2">
              <Label className="w-[180px] flex-none text-sm font-medium" htmlFor="price">
                {t("price")}
              </Label>
              <Input
                id="price"
                type="number"
                step="any"
                className="flex-1 min-w-[300px]"
                placeholder={t("price")}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-12 flex justify-center mt-4">
        <Button
          onClick={handleAddProductUnitSubmit}
          disabled={addingLoading}
          className="w-full max-w-[200px] gap-2"
        >
          {addingLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Upload className="w-4 h-4" />
          )}
          {t("add_unit")}
        </Button>
      </div>
    </div>
  );
};

export default AddProductUnitPage;
