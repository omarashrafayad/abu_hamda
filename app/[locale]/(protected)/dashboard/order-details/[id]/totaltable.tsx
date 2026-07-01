"use client";

import React from "react";
import { OrderDetailsItem } from "@/services/Orders/getOrderDetails";

interface TotalTableProps {
  items: OrderDetailsItem[];
  totalAmount: number;
  discountAmount: number;
  couponCode: string | null;
  t: (key: string) => string;
}

const TotalTable: React.FC<TotalTableProps> = ({
  items,
  totalAmount,
  discountAmount,
  couponCode,
  t,
}) => {
  // Subtotal is sum of item subTotals (or totalAmount if items is empty)
  const subtotal = items?.reduce((sum, item) => sum + (item.subTotal || 0), 0) || 0;
  // Invoice total is totalAmount (which might already include discount, or we subtract)
  // Let's display exactly what is returned
  const invoiceTotal = totalAmount;

  return (
    <>
      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="border-b border-default-200">
              <th className="bg-default-50 text-xs font-semibold uppercase text-default-600 text-left px-6 py-4 rtl:text-right">
                {t("itemName") || "Item Name"}
              </th>
              <th className="bg-default-50 text-xs font-semibold uppercase text-default-600 text-left px-6 py-4 rtl:text-right">
                {t("unit") || "Unit"}
              </th>
              <th className="bg-default-50 text-xs font-semibold uppercase text-default-600 text-center px-6 py-4">
                {t("quantity") || "Quantity"}
              </th>
              <th className="bg-default-50 text-xs font-semibold uppercase text-default-600 text-right px-6 py-4 rtl:text-left">
                {t("price") || "Unit Price"}
              </th>
              <th className="bg-default-50 text-xs font-semibold uppercase text-default-600 text-right px-6 py-4 rtl:text-left">
                {t("total") || "Total"}
              </th>
            </tr>
          </thead>
          <tbody>
            {items && items.length > 0 ? (
              items.map((item, index) => (
                <tr
                  key={item.id || index}
                  className="border-b border-default-100 hover:bg-default-50/50 transition-colors"
                >
                  <td className="text-default-900 text-sm font-medium px-6 py-4 text-left rtl:text-right">
                    {item.productName}
                  </td>
                  <td className="text-default-700 text-sm px-6 py-4 text-left rtl:text-right">
                    {item.unitName || "-"}
                  </td>
                  <td className="text-default-900 text-sm text-center px-6 py-4">
                    {item.quantity}
                  </td>
                  <td className="text-default-900 text-sm text-right px-6 py-4 rtl:text-left font-mono">
                    {item.price?.toFixed(2)}
                  </td>
                  <td className="text-default-900 text-sm text-right px-6 py-4 rtl:text-left font-semibold font-mono">
                    {item.subTotal?.toFixed(2)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-default-500">
                  {t("noItemsFound") || "No items found in this order"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:flex px-6 py-6 items-start gap-8 justify-between border-t border-default-100">
        <div className="flex-1 text-default-500 text-sm mb-4 md:mb-0 max-w-md">
          {/* Note or instructions can be added here if available */}
        </div>
        
        <div className="flex-none min-w-[300px] space-y-3 bg-default-50/50 p-4 rounded-xl border border-default-100">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium text-default-600 uppercase">
              {t("subtotal") || "Subtotal"}:
            </span>
            <span className="text-default-900 font-semibold font-mono">
              {subtotal.toFixed(2)}
            </span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between items-center text-sm text-rose-600">
              <span className="font-medium uppercase flex items-center gap-1.5">
                {t("couponDiscount") || "Coupon Discount"}:
                {couponCode && (
                  <span className="text-[11px] bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 uppercase font-mono">
                    {couponCode}
                  </span>
                )}
              </span>
              <span className="font-semibold font-mono">
                -{discountAmount.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center border-t border-default-200 pt-3 text-base">
            <span className="font-bold text-default-800 uppercase">
              {t("totalAmount") || "Total Amount"}:
            </span>
            <span className="text-default-950 font-extrabold font-mono text-lg">
              {invoiceTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default TotalTable;
