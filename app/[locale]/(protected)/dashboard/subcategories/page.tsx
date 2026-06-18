import React from 'react';
import TransactionsTable from "@/app/[locale]/(protected)/dashboard/subcategories/transactions";
import {Card} from "@/components/ui/card";


function SubCategories() {
    return (
        <>
            <Card>
                <TransactionsTable />
            </Card>
        </>
    );
}

export default SubCategories;
