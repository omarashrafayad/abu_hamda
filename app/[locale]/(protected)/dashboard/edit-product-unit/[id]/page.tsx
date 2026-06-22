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
import { useParams } from "next/navigation";
import useUpdateProductUnit from "@/services/productUnits/updateProductUnit";
import useGetProductUnitById from "@/services/productUnits/getProductUnitById";
import useGettingAllProducts from "@/services/products/gettingAllProducts";
import useGetUnits from "@/services/units/getAllUnits";
import { Loader2, Save } from "lucide-react";
import { useTranslations } from "next-intl";

const EditProductUnit = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const t = useTranslations("productUnits");

  const { updateProductUnit, loading: updatingLoading } = useUpdateProductUnit();
  const { getProductUnitById } = useGetProductUnitById();
  const { products, loading: productsLoading, getAllProducts } = useGettingAllProducts();
  const { units, loading: unitsLoading, getAllUnits } = useGetUnits();

  const [productId, setProductId] = useState("");
  const [productSearch, setProductSearch] = useState("");

  const [unitId, setUnitId] = useState("");
  const [unitSearch, setUnitSearch] = useState("");

  const [conversionRate, setConversionRate] = useState("");
  const [price, setPrice] = useState("");

  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products and units
        await Promise.all([
          getAllProducts("false", 1, 1000, ""),
          getAllUnits(),
        ]);
        
        // Fetch current product unit data
        if (id) {
          const data = await getProductUnitById(id);
          if (data) {
            setProductId(data.productId?.toString() || "");
            setUnitId(data.unitId?.toString() || "");
            setConversionRate(data.conversionRate?.toString() || "");
            setPrice(data.price?.toString() || "");
          }
        }
      } catch (error: any) {
        toast.error(t("errorFetch"));
      } finally {
        setFetching(false);
      }
    };

    fetchData();
  }, [id, t]);

  const filteredProducts = products?.filter((prod: any) =>
    (prod.name || "").toLowerCase().includes(productSearch.toLowerCase()) ||
    (prod.productName || "").toLowerCase().includes(productSearch.toLowerCase())
  ) || [];

  const filteredUnits = units?.filter((unit: any) =>
    (unit.name || "").toLowerCase().includes(unitSearch.toLowerCase())
  ) || [];

  // Finding names for initial display
  const selectedProduct = products.find((p: any) => p.id?.toString() === productId);
  const selectedUnit = units.find((u: any) => u.id?.toString() === unitId);

  const handleUpdateProductUnit = async () => {
    if (!productId || !unitId || !conversionRate || !price) {
      toast.error(t("validationError"), { description: t("fill_required_fields") });
      return;
    }

    const payload = {
      productId: Number(productId),
      unitId: Number(unitId),
      conversionRate: Number(conversionRate),
      price: Number(price),
    };

    try {
      const success = await updateProductUnit(id, payload);
      if (success) {
        toast.success(t("successUpdate"));
        setTimeout(() => {
          router.push("/dashboard/product-units");
        }, 1500);
      }
    } catch (error: any) {
      toast.error(typeof error === "string" ? error : t("errorUpdate"));
    }
  };

  const isDataLoading = fetching || productsLoading || unitsLoading;

  if (isDataLoading) {
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
            <CardTitle>{t("unit_information")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Product Selector */}
            <div className="flex items-center flex-wrap gap-2">
              <Label className="w-[180px] flex-none text-sm font-medium" htmlFor="productId">
                {t("productName")}
              </Label>
              <Select value={productId} onValueChange={(value) => setProductId(value)}>
                <SelectTrigger className="flex-1 min-w-[300px]">
                  <SelectValue placeholder={t("productName")}>
                    {selectedProduct ? selectedProduct.name : t("productName")}
                  </SelectValue>
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
              <Select value={unitId} onValueChange={(value) => setUnitId(value)}>
                <SelectTrigger className="flex-1 min-w-[300px]">
                  <SelectValue placeholder={t("unitName")}>
                    {selectedUnit ? selectedUnit.name : t("unitName")}
                  </SelectValue>
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
          onClick={handleUpdateProductUnit}
          disabled={updatingLoading}
          className="w-full max-w-[200px] gap-2"
        >
          {updatingLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Save className="h-4 w-4" />
              {t("save") || "Save"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default EditProductUnit;
