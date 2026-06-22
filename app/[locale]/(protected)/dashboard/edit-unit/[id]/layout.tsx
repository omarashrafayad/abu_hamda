import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Edit Unit',
    description: 'Edit Unit Page'
};

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
        </>
    );
};

export default Layout;
