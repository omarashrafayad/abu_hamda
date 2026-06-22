import React from 'react';
import { Card } from "@/components/ui/card";
import ProductUnitsTable from './transactions';

function ProductUnits() {
    return (
        <>
            <Card>
                <ProductUnitsTable />
            </Card>
        </>
    );
}

export default ProductUnits;
