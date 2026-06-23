import React from 'react';
import { Card } from "@/components/ui/card";
import StockProductsTable from './transactions';

function StockProducts() {
    return (
        <>
            <Card>
                <StockProductsTable />
            </Card>
        </>
    );
}

export default StockProducts;
