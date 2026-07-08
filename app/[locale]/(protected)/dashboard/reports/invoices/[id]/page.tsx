"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useRouter, Link } from "@/i18n/routing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Calendar, FileText, ShoppingBag, User } from "lucide-react";
import { formatDateToDMY } from "@/utils";
import { useTranslations } from "next-intl";
import useGettingInvoiceById from "@/services/invoices/gettingInvoiceById";
import { Separator } from "@/components/ui/separator";

const InvoiceDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const invoiceId = params?.id as string;

  const { invoice, loading, error, gettingInvoiceById } = useGettingInvoiceById();
  const t = useTranslations("Invoices");

  useEffect(() => {
    if (invoiceId) {
      gettingInvoiceById(invoiceId);
    }
  }, [invoiceId, gettingInvoiceById]);

  const handleBack = () => {
    router.push("/dashboard/reports/invoices");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 p-6 text-center">
        <p className="text-xl font-semibold text-destructive">{error}</p>
        <Button onClick={handleBack} variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 rtl:rotate-180" />
          {t("close")}
        </Button>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 p-6 text-center">
        <p className="text-xl font-semibold text-muted-foreground">{t("noInvoices")}</p>
        <Button onClick={handleBack} variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0 rtl:rotate-180" />
          {t("close")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header section with back button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handleBack}
            className="h-9 w-9 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{t("invoiceDetails")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("invoiceNumber")}: #{invoice.invoiceNumber}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Invoice info and items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <span>Invoice Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t("invoiceNumber")}
                  </p>
                  <p className="text-sm font-semibold">{invoice.invoiceNumber}</p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{t("date")}</span>
                  </p>
                  <p className="text-sm font-semibold">{formatDateToDMY(invoice.issuedAt)}</p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{t("orderNumber")}</span>
                  </p>
                  <Link
                    href={`/dashboard/order-details/${invoice.orderId}`}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    #{invoice.orderId}
                  </Link>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>Customer ID</span>
                  </p>
                  <p className="text-sm font-mono truncate select-all" title={invoice.userId}>
                    {invoice.userId}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Items card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("items")}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left rtl:text-right">
                  <thead className="bg-muted/50 text-xs font-semibold text-muted-foreground uppercase border-b border-border/60">
                    <tr>
                      <th className="px-6 py-4">{t("itemName")}</th>
                      <th className="px-6 py-4 text-center">Unit</th>
                      <th className="px-6 py-4 text-center">{t("quantity")}</th>
                      <th className="px-6 py-4 text-right rtl:text-left">{t("price")}</th>
                      <th className="px-6 py-4 text-right rtl:text-left">{t("total")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {invoice.order?.items?.map((item: any) => (
                      <tr key={item.id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">{item.productName}</td>
                        <td className="px-6 py-4 text-center text-muted-foreground text-xs">{item.unitName || "-"}</td>
                        <td className="px-6 py-4 text-center font-medium">{item.quantity}</td>
                        <td className="px-6 py-4 text-right rtl:text-left font-mono">{item.price}</td>
                        <td className="px-6 py-4 text-right rtl:text-left font-mono font-semibold">{item.subTotal}</td>
                      </tr>
                    ))}
                    {(!invoice.order?.items || invoice.order.items.length === 0) && (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground font-medium">
                          No items found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Column: Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t("subTotal")}</span>
                <span className="font-mono font-medium text-foreground">{invoice.subTotal}</span>
              </div>

              {invoice.discountAmount > 0 && (
                <div className="flex justify-between text-sm text-success font-semibold">
                  <span>{t("discount")}</span>
                  <span className="font-mono">- {invoice.discountAmount}</span>
                </div>
              )}

              <Separator />

              <div className="flex justify-between items-center pt-2">
                <span className="text-base font-bold text-foreground">{t("totalAmount")}</span>
                <span className="text-xl font-bold font-mono text-primary">{invoice.totalAmount}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsPage;
