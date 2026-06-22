import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Units',
    description: 'Units List Page'
};

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <>
            {children}
        </>
    );
};

export default Layout;
