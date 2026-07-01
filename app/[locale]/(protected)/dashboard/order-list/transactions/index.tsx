"use client";

import * as React from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { baseColumns } from "./columns";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import TablePagination from "./table-pagination";
import { Card, CardContent } from "@/components/ui/card";
import useGettingAllOrders from "@/services/Orders/gettingAllOrders";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderStatus, OrderStatusLabel } from "@/enum";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";

export default function TransactionsTable() {
  const { gettingAllOrders, orders, loading, error } = useGettingAllOrders();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const t = useTranslations("OrderList");

  // Normalize orders: coerce status from string to number
  const normalizedOrders = React.useMemo(() => {
    if (!orders || !Array.isArray(orders)) return [];
    return orders.map((order: any) => ({
      ...order,
      status: order.status !== undefined ? Number(order.status) : 0,
    }));
  }, [orders]);

  const columns = baseColumns({
    refresh: () => gettingAllOrders(),
    t,
  });

  const table = useReactTable({
    data: filteredOrders ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const filterOrdersByStatus = (status: OrderStatus | "all") => {
    setSelectedStatus(status);
    if (!normalizedOrders) return;

    if (status === "all") {
      setFilteredOrders(normalizedOrders);
    } else {
      const filtered = normalizedOrders.filter(
        (order: any) => Number(order.status) === status
      );
      setFilteredOrders(filtered);
    }
  };

  useEffect(() => {
    gettingAllOrders();
  }, [gettingAllOrders]);

  useEffect(() => {
    if (normalizedOrders) {
      filterOrdersByStatus(selectedStatus);
    }
  }, [normalizedOrders, selectedStatus]);

  // Search filter by order id
  useEffect(() => {
    if (!searchTerm.trim()) {
      filterOrdersByStatus(selectedStatus);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = normalizedOrders.filter((order: any) => {
      const matchesStatus =
        selectedStatus === "all" || Number(order.status) === selectedStatus;
      const matchesSearch =
        String(order.id).toLowerCase().includes(term) ||
        (order.couponCode && order.couponCode.toLowerCase().includes(term));
      return matchesStatus && matchesSearch;
    });
    setFilteredOrders(filtered);
  }, [searchTerm]);

  return (
    <Card className="w-full">
      <div className="px-5 py-4 flex flex-col md:flex-row items-center gap-4">
        <div className="w-full md:w-auto flex-1">
          <Input
            placeholder={t("searchPlaceholder") || "Search by order ID..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center justify-center md:justify-end">
          <Button
            size="md"
            variant={selectedStatus === "all" ? "default" : "outline"}
            color="default"
            className="ring-0 outline-0 hover:ring-0 hover:ring-offset-0 font-normal border-default-200 rounded-md cursor-pointer"
            onClick={() => filterOrdersByStatus("all")}
          >
            {t("All")}
          </Button>

          <Button
            size="md"
            variant={selectedStatus === OrderStatus.Pending ? "default" : "outline"}
            color="default"
            className="ring-0 outline-0 hover:ring-0 hover:ring-offset-0 font-normal border-default-200 rounded-md cursor-pointer"
            onClick={() => filterOrdersByStatus(OrderStatus.Pending)}
          >
            {t(`statusCode.${OrderStatusLabel[OrderStatus.Pending].toLowerCase()}`)}
          </Button>

          <Button
            size="md"
            variant={selectedStatus === OrderStatus.Confirmed ? "default" : "outline"}
            color="default"
            className="ring-0 outline-0 hover:ring-0 hover:ring-offset-0 font-normal border-default-200 rounded-md cursor-pointer"
            onClick={() => filterOrdersByStatus(OrderStatus.Confirmed)}
          >
            {t(`statusCode.${OrderStatusLabel[OrderStatus.Confirmed].toLowerCase()}`)}
          </Button>

          <Button
            size="md"
            variant={selectedStatus === OrderStatus.Rejected ? "default" : "outline"}
            color="default"
            className="ring-0 outline-0 hover:ring-0 hover:ring-offset-0 font-normal border-default-200 rounded-md cursor-pointer"
            onClick={() => filterOrdersByStatus(OrderStatus.Rejected)}
          >
            {t(`statusCode.${OrderStatusLabel[OrderStatus.Rejected].toLowerCase()}`)}
          </Button>

          <Button
            size="md"
            variant={selectedStatus === OrderStatus.Prepared ? "default" : "outline"}
            color="default"
            className="ring-0 outline-0 hover:ring-0 hover:ring-offset-0 font-normal border-default-200 rounded-md cursor-pointer"
            onClick={() => filterOrdersByStatus(OrderStatus.Prepared)}
          >
            {t(`statusCode.${OrderStatusLabel[OrderStatus.Prepared].toLowerCase()}`)}
          </Button>

          <Button
            size="md"
            variant={selectedStatus === OrderStatus.Shipped ? "default" : "outline"}
            color="default"
            className="ring-0 outline-0 hover:ring-0 hover:ring-offset-0 font-normal border-default-200 rounded-md cursor-pointer"
            onClick={() => filterOrdersByStatus(OrderStatus.Shipped)}
          >
            {t(`statusCode.${OrderStatusLabel[OrderStatus.Shipped].toLowerCase()}`)}
          </Button>

          <Button
            size="md"
            variant={selectedStatus === OrderStatus.Delivered ? "default" : "outline"}
            color="default"
            className="ring-0 outline-0 hover:ring-0 hover:ring-offset-0 font-normal border-default-200 rounded-md cursor-pointer"
            onClick={() => filterOrdersByStatus(OrderStatus.Delivered)}
          >
            {t(`statusCode.${OrderStatusLabel[OrderStatus.Delivered].toLowerCase()}`)}
          </Button>

          <Button
            size="md"
            variant={selectedStatus === OrderStatus.Cancel ? "default" : "outline"}
            color="default"
            className="ring-0 outline-0 hover:ring-0 hover:ring-offset-0 font-normal border-default-200 rounded-md cursor-pointer"
            onClick={() => filterOrdersByStatus(OrderStatus.Cancel)}
          >
            {t(`statusCode.${OrderStatusLabel[OrderStatus.Cancel].toLowerCase()}`)}
          </Button>

          <Button
            size="md"
            variant={selectedStatus === OrderStatus.Completed ? "default" : "outline"}
            color="default"
            className="ring-0 outline-0 hover:ring-0 hover:ring-offset-0 font-normal border-default-200 rounded-md cursor-pointer"
            onClick={() => filterOrdersByStatus(OrderStatus.Completed)}
          >
            {t(`statusCode.${OrderStatusLabel[OrderStatus.Completed].toLowerCase()}`)}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-full py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : (
        <CardContent>
          <div className="border border-solid border-default-200 rounded-lg overflow-hidden border-t-0">
            <Table>
              <TableHeader className="bg-default-200">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead className="last:text-start" key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="h-[75px]">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center font-medium"
                    >
                      {t("noOrdersFound") || "No orders found."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      )}
      <TablePagination table={table} />
    </Card>
  );
}
