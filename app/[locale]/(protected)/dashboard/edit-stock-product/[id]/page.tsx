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
import useUpdateStockProduct from "@/services/stockProducts/updateStockProduct";
import useGetStockProductById from "@/services/stockProducts/getStockProductById";
import { Loader2, Save } from "lucide-react";
import { useTranslations } from "next-intl";
import useGettingAllProducts from "@/services/products/gettingAllProducts";

const EditStockProduct = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const t = useTranslations("stockProducts");

  const { updateStockProduct, loading: updatingLoading } = useUpdateStockProduct();
  const { getStockProductById } = useGetStockProductById();
  const { products, loading: productsLoading, getAllProducts } = useGettingAllProducts();

 const [productId, setProductId] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getAllProducts("false", 1, 1000, "");
        
        if (id) {
          const data = await getStockProductById(id);
          if (data) {
            setProductId(data.productId?.toString() || "");
            setQuantity(data.quantity?.toString() || "");
            setExpiryDate(data.expiryDate ? data.expiryDate.split("T")[0] : "");
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

  const selectedProduct = products.find((prod: any) => prod.id?.toString() === productId);

  const handleUpdateStockProduct = async () => {
    if (!productId || !quantity || !expiryDate) {
      toast.error(t("validationError"), { description: t("fill_required_fields") });
      return;
    }

    const payload = {
      productId: Number(productId),
      quantity: Number(quantity),
      expiryDate: new Date(expiryDate).toISOString(),
    };

    try {
      const success = await updateStockProduct(id, payload);
      if (success) {
        toast.success(t("successUpdate"));
        setTimeout(() => {
          router.push("/dashboard/stock-products");
        }, 1500);
      }
    } catch (error: any) {
      toast.error(typeof error === "string" ? error : t("errorUpdate"));
    }
  };

  const isDataLoading = fetching || productsLoading;

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
            <CardTitle>{t("stock_information")}</CardTitle>
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
                        {prod.name} ({prod.unitName})
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
            <div className="flex items-center flex-wrap gap-2">
              <Label className="w-[180px] flex-none text-sm font-medium" htmlFor="expiryDate">
                {t("expiryDate")}
              </Label>
              <Input
                id="expiryDate"
                type="date"
                className="flex-1 min-w-[300px]"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-12 flex justify-center mt-4">
        <Button
          onClick={handleUpdateStockProduct}
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

export default EditStockProduct;
