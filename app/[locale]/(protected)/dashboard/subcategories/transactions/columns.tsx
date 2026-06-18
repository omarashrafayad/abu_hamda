"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SquarePen, Trash2 } from "lucide-react";
import { Link } from '@/i18n/routing';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SubCategoryType } from "@/types/subcategory";
import useDeleteSubCategoryById from "@/services/subcategories/DeleteSubCategory";

export const baseColumns = ({ refresh, t }: { refresh: () => void, t: (key: string) => string; }): ColumnDef<SubCategoryType>[] => [
  {
    accessorKey: "name",
    header: t("subcategory_name"),
    cell: ({ row }) => <span>{row.getValue("name") || t("unknown")}</span>,
  },
  {
    accessorKey: "categoryName",
    header: t("category_name"),
    cell: ({ row }) => <span>{row.getValue("categoryName") || t("unknown")}</span>,
  },
  {
    id: "actions",
    accessorKey: "action",
    header: t("actions"),
    enableHiding: false,
    cell: ({ row }) => {
      const id: string | number | undefined = row.original.id;
      const { deleteSubCategoryById, loading } = useDeleteSubCategoryById();

      const handleDelete = () => {
        const toastId = toast(t("delete_subcategory"), {
          description: t("delete_subcategory_confirm"),
          action: (
            <div className="flex justify-end mx-auto items-center my-auto gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast.dismiss(toastId)}
                className="px-3 py-1 rounded-md"
              >
                {t("cancel")}
              </Button>

              <Button
                size="sm"
                variant="outline"
                disabled={loading}
                className="px-3 py-1 rounded-md text-white bg-red-600 border-red-600 hover:bg-red-700"
                onClick={async () => {
                  try {
                    const { success, error } = await deleteSubCategoryById(id as string);
                    toast.dismiss(toastId);

                    if (success) {
                      toast.success(t("subcategory_deleted"), {
                        description: t("subcategory_deleted_success"),
                      });
                      refresh();
                    } else {
                      throw new Error(error);
                    }
                  } catch (error) {
                    toast.dismiss(toastId);
                    toast.error(t("error"), {
                      description: (error as Error).message,
                    });
                  }
                }}
              >
                {t("confirm")}
              </Button>
            </div>
          ),
        });
      };

      return (
        <div className="flex items-center gap-1">
          <Link
            href={`/dashboard/edit-subcategory/${id}`}
            className="flex items-center p-2 border-b text-info hover:text-info-foreground bg-info/40 hover:bg-info duration-200 transition-all rounded-full cursor-pointer"
          >
            <SquarePen className="w-4 h-4" />
          </Link>
          <div
            onClick={handleDelete}
            className="flex items-center p-2 text-destructive bg-destructive/40 duration-200 transition-all hover:bg-destructive/80 hover:text-destructive-foreground rounded-full cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </div>
        </div>
      );
    },
  },
];
