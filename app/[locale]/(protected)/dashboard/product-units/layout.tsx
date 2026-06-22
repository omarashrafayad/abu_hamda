import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Product Units',
    description: 'Product Units List Page'
};

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
        </>
    );
};

export default Layout;
