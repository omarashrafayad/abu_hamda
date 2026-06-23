import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Edit Stock Product',
  description: 'Edit Stock Product Page'
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
    </>
  );
};

export default Layout;
