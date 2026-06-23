"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SquarePen, Trash2 } from "lucide-react";
import { Link } from '@/i18n/routing';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { StockProductType } from "@/types/stockProduct";
import useDeleteStockProduct from "@/services/stockProducts/deleteStockProduct";

export const baseColumns = ({ refresh, t }: { refresh: () => void; t: (key: string) => string }): ColumnDef<StockProductType>[] => [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <span>{row.getValue("id")}</span>,
    },
    {
        accessorKey: "productName",
        header: t("productName"),
        cell: ({ row }) => <span>{row.getValue("productName") || "-"}</span>,
    },
    {
        accessorKey: "unitName",
        header: t("unitName"),
        cell: ({ row }) => <span>{row.getValue("unitName") || "-"}</span>,
    },
    {
        accessorKey: "quantity",
        header: t("quantity"),
        cell: ({ row }) => <span>{row.getValue("quantity")}</span>,
    },
    {
        id: "actions",
        accessorKey: "action",
        header: t("actions"),
        enableHiding: false,
        cell: ({ row }) => {
            const id = row.original.id;
            const { deleteStockProduct, loading } = useDeleteStockProduct();

            const handleDelete = () => {
                const toastId = toast(t("delete_stock"), {
                    description: t("confirmDelete"),
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
                                        const isSuccess = await deleteStockProduct(id as string | number);
                                        
                                        toast.dismiss(toastId);

                                        if (isSuccess) {
                                            toast.success(t("successDelete"));
                                            refresh(); 
                                        } else {
                                            throw new Error("Failed to delete");
                                        }
                                    } catch (error: any) {
                                        toast.dismiss(toastId);
                                        toast.error(t("errorDelete"), {
                                            description: typeof error === 'string' ? error : error.message,
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
                        href={`/dashboard/edit-stock-product/${id}`}
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
