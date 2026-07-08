import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { formatDateToDMY } from "@/utils";
import { Link } from "@/i18n/routing";

export const baseColumns = ({ t }: { t: any }): ColumnDef<any>[] => [
  {
    accessorKey: "invoiceNumber",
    header: t("invoiceNumber"),
    cell: ({ row }) => (
      <span className="font-medium text-default-900">
        {row.original.invoiceNumber}
      </span>
    ),
  },
  {
    accessorKey: "orderId",
    header: t("orderNumber"),
    cell: ({ row }) => (
      <span className="font-medium text-default-800">
        #{row.original.orderId}
      </span>
    ),
  },
  {
    accessorKey: "issuedAt",
    header: t("date"),
    cell: ({ row }) => (
      <span className="text-default-600">{formatDateToDMY(row.original.issuedAt)}</span>
    ),
  },
  {
    accessorKey: "subTotal",
    header: t("subTotal"),
    cell: ({ row }) => (
      <span className="font-mono text-default-700">{row.original.subTotal}</span>
    ),
  },
  {
    accessorKey: "discountAmount",
    header: t("discount"),
    cell: ({ row }) => (
      <span className={row.original.discountAmount > 0 ? "text-success font-semibold font-mono" : "text-muted-foreground font-mono"}>
        {row.original.discountAmount}
      </span>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: t("totalAmount"),
    cell: ({ row }) => (
      <span className="font-bold text-primary font-mono">{row.original.totalAmount}</span>
    ),
  },
  {
    id: "actions",
    header: t("actions"),
    cell: ({ row }) => (
      <div className="flex items-center justify-center py-1">
        <Link
          href={`/dashboard/reports/invoices/${row.original.id}`}
          className="flex items-center p-1.5 text-warning hover:text-warning-foreground bg-warning/20 hover:bg-warning duration-200 transition-all rounded-full cursor-pointer"
          title={t("viewDetails")}
        >
          <Eye className="w-3.5 h-3.5" />
        </Link>
      </div>
    ),
  },
];
