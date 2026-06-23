import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Stock Products',
    description: 'Stock Products List Page'
};

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
        </>
    );
};

export default Layout;
