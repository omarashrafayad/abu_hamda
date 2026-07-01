import { ColumnDef } from "@tanstack/react-table";
import {
  Eye,
  Trash2,
  Pencil,
  ArrowUpDown,
  Printer
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Link } from '@/i18n/routing';
import { formatDateToDMY } from "@/utils";
import Cookies from "js-cookie";

import GenerateInvoiceButton from "@/components/partials/GenerateInvoiceButton/GenerateInvoiceButton";
import { OrderStatus } from "@/enum";
import useUpdateOrderStatus from "@/services/Orders/updateOrderStatus";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";


const StatusCell = ({ row, t }: { row: any; t: (key: string) => string }) => {
  const statusColors: Record<number, string> = {
    0: "bg-yellow-200 text-yellow-700",
    1: "bg-blue-200 text-blue-700",
    2: "bg-red-200 text-red-700",
    3: "bg-purple-200 text-purple-700",
    4: "bg-indigo-200 text-indigo-700",
    5: "bg-green-200 text-green-700",
    6: "bg-emerald-200 text-emerald-700",
    7: "bg-default-200 text-default-700",
    8: "bg-orange-200 text-orange-700",
    9: "bg-rose-200 text-rose-700",
  };

  const statusTranslationKeys: Record<number, string> = {
    0: "statusCode.pending",
    1: "statusCode.confirmed",
    2: "statusCode.rejected",
    3: "statusCode.prepared",
    4: "statusCode.shipped",
    5: "statusCode.delivered",
    6: "statusCode.completed",
    7: "statusCode.ReAssignTo",
    8: "statusCode.Refund",
    9: "statusCode.Cancel",
  };

  const status = Number(row.original.status);
  const statusStyle = statusColors[status] || "bg-gray-200 text-gray-700";
  const statusLabel = t(statusTranslationKeys[status] ?? "status.unknown");

  return (
    <div className="flex items-center gap-1.5 text-xs">
      <Badge className={cn("rounded-full px-2.5 py-0.5 text-[11px] whitespace-nowrap", statusStyle)}>
        {statusLabel}
      </Badge>
    </div>
  );
};

const StatusDialog = ({ row, refresh, t }: { row: any; refresh: () => void; t: (key: string) => string }) => {
  const { updateOrderStatus, loading } = useUpdateOrderStatus();
  const [open, setOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>(String(row.original.status));

  const handleUpdate = async () => {
    const numericValue = Number(selectedStatus) as OrderStatus;
    const result = await updateOrderStatus(row.original.id, numericValue);

    if (result.success) {
      toast.success(t("updateStatusSuccess") || "Status updated successfully");
      setOpen(false);
      refresh();
    } else {
      toast.error(result.error || t("updateStatusError") || "Failed to update status");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="flex items-center p-2 text-warning hover:text-warning-foreground bg-warning/20 hover:bg-warning duration-200 transition-all rounded-full cursor-pointer"
          title={t("updateStatus") || "Update Status"}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("updateStatus") || "Update Status"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">{t("orderStatus")}</label>
            <Select
              value={selectedStatus}
              onValueChange={setSelectedStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectStatus") || "Select Status"} />
              </SelectTrigger>
              <SelectContent>
                {Object.values(OrderStatus)
                  .filter((value) => typeof value === "number")
                  .map((s) => (
                    <SelectItem key={s} value={s.toString()} className="text-xs">
                      {t(`statusCode.${OrderStatus[s as number].toLowerCase()}`)}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            {t("cancel") || "Cancel"}
          </Button>
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {t("save") || "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const baseColumns = ({ refresh, t }: {
  refresh: () => void;
  t: (key: string) => string;
}): ColumnDef<any>[] => {
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "id",
      header: t("orderNumber"),
      cell: ({ row }) => (
        <span>
          <Link
            href={`/dashboard/order-details/${row.original.id}`}
            className="hover:text-default-900 cursor-pointer bg-transparent border-none p-0 outline-none font-semibold text-sm text-default-800 transition-colors"
          >
            {row.original.id}
          </Link>
        </span>
      ),
    },
    {
      accessorKey: "orderDate",
      header: t("date"),
      cell: ({ row }) => <span>{formatDateToDMY(row.original.orderDate)}</span>,
    },
    {
      accessorKey: "totalAmount",
      header: t("totalAmount") || "Total Amount",
      cell: ({ row }) => <span>{row.original.totalAmount ?? "N/A"}</span>,
    },
    {
      accessorKey: "discountAmount",
      header: t("discountAmount") || "Discount",
      cell: ({ row }) => <span>{row.original.discountAmount ?? 0}</span>,
    },
    {
      accessorKey: "couponCode",
      header: t("couponCode") || "Coupon Code",
      cell: ({ row }) => <span>{row.original.couponCode || "-"}</span>,
    },
    {
      accessorKey: "status",
      header: t("orderStatus"),
      cell: ({ row }) => <StatusCell row={row} t={t} />,
    },
    {
      id: "actions",
      accessorKey: "action",
      header: t("actions"),
      enableHiding: false,
      cell: ({ row }) => {
        const userRole = Cookies.get("userRole");
        const isAdmin = userRole == "Admin";
        const order = row.original;

        return (
          <div className="flex items-center gap-1.5 py-1 justify-center">
            <Link
              href={`/dashboard/order-details/${order.id}`}
              className="flex items-center p-1.5 border-b text-warning hover:text-warning-foreground bg-warning/20 hover:bg-warning duration-200 transition-all rounded-full cursor-pointer"
              title="View Details"
            >
              <Eye className="w-3.5 h-3.5" />
            </Link>
            <Link
              href={`/dashboard/order-details/${order.id}?print=true`}
              className="flex items-center p-1.5 border-b text-info hover:text-info-foreground bg-info/20 hover:bg-info duration-200 transition-all rounded-full cursor-pointer"
              title="Print Order"
            >
              <Printer className="w-3.5 h-3.5" />
            </Link>
              <>
                <StatusDialog row={{ original: order }} refresh={refresh} t={t} />
                <Link
                  href={`/dashboard/edit-order/${order.id}`}
                  className="flex items-center p-1.5 text-primary bg-primary/20 duration-200 transition-all hover:bg-primary/80 hover:text-primary-foreground rounded-full cursor-pointer"
                  title="Edit Order"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href={`/dashboard/remove-item/${order.id}`}
                  className="flex items-center p-1.5 text-destructive bg-destructive/40 duration-200 transition-all hover:bg-destructive/80 hover:text-destructive-foreground rounded-full cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Link>

                {Number(order.status) === OrderStatus.Completed && (
                  <GenerateInvoiceButton isDisabled={false} orderNumber={order.id} />
                )}
              </>
          </div>
        );
      },
    },
  ];

  return columns;
};
