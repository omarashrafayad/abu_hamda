"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import useAddUnit from "@/services/units/addUnit"; 
import { Loader2, Upload } from "lucide-react"; 
import { useTranslations } from "next-intl";

const AddUnitPage = () => {
  const { addUnit, loading } = useAddUnit(); 
  const router = useRouter();
  const t = useTranslations("units");

  const [name, setName] = useState("");

  const handleAddUnitSubmit = async () => {
    if (!name.trim()) {
      toast.error(t("validationError"), { 
        description: t("fill_required_fields") || "Please fill in the unit name"
      });
      return;
    }

    try {
      const success = await addUnit({ name });
      
      if (success) {
        toast.success(t("successAdd"));
        setTimeout(() => {
          router.push("/dashboard/units");
        }, 1000);
      }
    } catch (error: any) {
      toast.error(t("errorAdd"), {
        description: typeof error === 'string' ? error : error.message,
      });
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 rounded-lg">
      <div className="col-span-12">
        <Card>
          <CardHeader className="border-b border-solid border-default-200 mb-6">
            <CardTitle>{t("unit_information")} </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            
            <div className="flex items-center flex-wrap gap-2">
              <Label className="w-[180px] flex-none text-sm font-medium" htmlFor="unitName">
                {t("unitName")}
              </Label>
              <Input
                id="unitName"
                className="flex-1 min-w-[300px]"
                placeholder={t("unitName")}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            
          </CardContent>
        </Card>
      </div>

      <div className="col-span-12 flex justify-center mt-4">
        <Button 
          onClick={handleAddUnitSubmit} 
          disabled={loading} 
          className="w-full max-w-[200px] gap-2"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin"/>
          ) : (
            <Upload className="w-4 h-4"/>
          )}
          {t("add_unit")}
        </Button>
      </div>
    </div>
  );
};

export default AddUnitPage;
