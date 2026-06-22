"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useRouter } from "@/i18n/routing";
import { useParams } from "next/navigation";
import useUpdateUnit from "@/services/units/updateUnit"; 
import useGetUnitById from "@/services/units/getUnitById";
import { Loader2, Save } from "lucide-react";
import { useTranslations } from "next-intl";

const EditUnit = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string; 
  const t = useTranslations("units");

  const { updateUnit, loading: updatingLoading } = useUpdateUnit();
  const { getUnitById } = useGetUnitById();

  const [name, setName] = useState("");
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const getUnitData = async () => {
      try {
        const data = await getUnitById(id);
        if (data) {
          setName(data.name || "");
        }
      } catch (error: any) {
        toast.error(t("errorFetch"));
      } finally {
        setFetching(false);
      }
    };

    if (id) getUnitData();
  }, [id, t]);

  const handleUpdateUnit = async () => {
    if (!name.trim()) {
      toast.error(t("validationError"), { description: t("fill_required_fields") });
      return;
    }

    try {
      const success = await updateUnit(id, { name });
      if (success) {
        toast.success(t("successUpdate"));
        setTimeout(() => {
          router.push("/dashboard/units");
        }, 1500);
      }
    } catch (error: any) {
      toast.error(typeof error === "string" ? error : t("errorUpdate"));
    }
  };

  if (fetching) {
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
            <div className="flex items-center flex-wrap gap-2">
              <Label className="w-[180px] flex-none text-sm font-medium" htmlFor="unit-name">
                {t("unitName")}
              </Label>
              <Input
                id="unit-name"
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
          onClick={handleUpdateUnit} 
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

export default EditUnit;
