import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Edit Product Unit',
    description: 'Edit Product Unit Page'
};

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
        </>
    );
};

export default Layout;
