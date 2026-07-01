"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, Printer, Calendar, User, Tag, ShoppingBag } from "lucide-react";
import { formatDateToDMY } from "@/utils";
import { useTranslations } from "next-intl";
import useGetOrderDetails from "@/services/Orders/getOrderDetails";
import TotalTable from "./totaltable";
import { cn } from "@/lib/utils";

const OrderDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const orderId = params?.id as string;
  const isPrintMode = searchParams?.get("print") === "true";

  const { order, loading, error, getOrderDetails } = useGetOrderDetails();

  const tList = useTranslations("OrderList");
  const tDetails = useTranslations("orderDetailsPage");

  useEffect(() => {
    if (orderId) {
      getOrderDetails(orderId);
    }
  }, [orderId, getOrderDetails]);

  // Handle printing when order is loaded and print param is true
  useEffect(() => {
    if (order && isPrintMode) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [order, isPrintMode]);

  const handlePrint = () => {
    if (isPrintMode) {
      window.print();
    } else {
      router.push(`/dashboard/order-details/${orderId}?print=true`);
    }
  };

  const handleBack = () => {
    router.push("/dashboard/order-list");
  };

  const statusColors: Record<number, string> = {
    0: "bg-yellow-250 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300",
    1: "bg-blue-200 text-blue-800 dark:bg-blue-950 dark:text-blue-300",
    2: "bg-red-200 text-red-800 dark:bg-red-950 dark:text-red-300",
    3: "bg-purple-200 text-purple-800 dark:bg-purple-950 dark:text-purple-300",
    4: "bg-indigo-200 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300",
    5: "bg-green-200 text-green-800 dark:bg-green-950 dark:text-green-300",
    6: "bg-emerald-250 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
    7: "bg-default-200 text-default-850 dark:bg-default-850 dark:text-default-300",
    8: "bg-orange-200 text-orange-850 dark:bg-orange-950 dark:text-orange-300",
    9: "bg-rose-200 text-rose-800 dark:bg-rose-950 dark:text-rose-300",
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

  const status = order ? Number(order.status) : 0;
  const statusStyle = statusColors[status] || "bg-gray-200 text-gray-800";
  const statusLabel = tList(statusTranslationKeys[status] ?? "status.unknown");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6    max-w-4xl mx-auto space-y-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center gap-2 mb-4 hover:bg-default-100 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{tDetails("cancel") || "Back"}</span>
        </Button>
        <div className="flex flex-col items-center justify-center py-20 bg-card rounded-xl border border-destructive/50 text-center space-y-4">
          <p className="text-xl font-semibold text-destructive">{tDetails("noOrderFound") || "Error Loading Order"}</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center gap-2 mb-4 hover:bg-default-100 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{tDetails("cancel") || "Back"}</span>
        </Button>
        <div className="flex flex-col items-center justify-center py-20 bg-card rounded-xl border border-border/50 text-center space-y-4">
          <p className="text-xl font-semibold text-muted-foreground">{tDetails("noOrderFound") || "No order found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* CSS print hack to make sure only the printable-order element is printed */}
      {isPrintMode && (
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body {
              background-color: white !important;
              color: black !important;
            }
            .no-print {
              display: none !important;
            }
            #printable-order {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              border: none !important;
              box-shadow: none !important;
              padding: 0 !important;
              margin: 0 !important;
            }
          }
        `}} />
      )}

      {/* Header controls (hidden on print) */}
      <div className="flex justify-between items-center gap-4 no-print">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="flex items-center gap-2 hover:bg-default-100 text-default-600 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>{tDetails("BacktoOrders") || "Back to Orders"}</span>
        </Button>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handlePrint}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{tList("print") || "Print Order"}</span>
          </Button>
        </div>
      </div>

      {/* Printable Area */}
      <Card id="printable-order" className="border border-default-100 shadow-sm overflow-hidden bg-card">
        {/* Card Header */}
        <div className="border-b border-default-100 py-6 px-6 bg-default-50/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                {tDetails("orderDetails") || "Order Details"}
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-default-900">
                  {tDetails("orderNumberLabel") || "Order"}: #{order.id}
                </h1>
                <Badge className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap", statusStyle)}>
                  {statusLabel}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-default-500 text-sm">
              <Calendar className="w-4 h-4 text-default-400" />
              <span className="font-medium">
                {order.orderDate ? formatDateToDMY(order.orderDate) : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <CardContent className="p-0">
          {/* Metadata Cards Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border-b border-default-100">
            {/* Customer Details */}
            <div className="flex gap-4 p-4 rounded-xl border border-default-100 bg-card hover:shadow-sm transition-shadow">
              <div className="flex-none p-3 bg-primary/10 rounded-xl text-primary h-fit">
                <User className="w-5 h-5" />
              </div>
              <div className="space-y-1 overflow-hidden">
                <span className="block text-xs text-default-500 font-medium">
                  {tDetails("customer") || "Customer ID"}
                </span>
                <span className="block text-sm font-semibold text-default-800 break-all">
                  {order.userId || "N/A"}
                </span>
              </div>
            </div>

            {/* Coupon Information */}
            <div className="flex gap-4 p-4 rounded-xl border border-default-100 bg-card hover:shadow-sm transition-shadow">
              <div className="flex-none p-3 bg-rose-500/10 rounded-xl text-rose-500 h-fit">
                <Tag className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="block text-xs text-default-500 font-medium">
                  {tDetails("coupon") || "Coupon Information"}
                </span>
                {order.couponCode ? (
                  <>
                    <span className="inline-block text-xs bg-rose-50 text-rose-600 border border-rose-200 px-1.5 py-0.5 rounded uppercase font-mono font-semibold">
                      {order.couponCode}
                    </span>
                    <span className="block text-xs text-rose-600 font-medium mt-0.5">
                      {tDetails("couponDiscount") || "Discount"}: {order.discountAmount}
                    </span>
                  </>
                ) : (
                  <span className="block text-sm font-semibold text-default-400">
                    {tDetails("noCoupon") || "No coupon applied"}
                  </span>
                )}
              </div>
            </div>

            {/* Total Items */}
            <div className="flex gap-4 p-4 rounded-xl border border-default-100 bg-card hover:shadow-sm transition-shadow">
              <div className="flex-none p-3 bg-emerald-500/10 rounded-xl text-emerald-500 h-fit">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <span className="block text-xs text-default-500 font-medium">
                  {tDetails("totalItems") || "Total Items"}
                </span>
                <span className="block text-sm font-semibold text-default-800">
                  {order.items?.length || 0} {tDetails("items") || "Items"}
                </span>
              </div>
            </div>
          </div>

          {/* Table Component */}
          <TotalTable
            items={order.items || []}
            totalAmount={order.totalAmount}
            discountAmount={order.discountAmount}
            couponCode={order.couponCode}
            t={tDetails}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailsPage;
