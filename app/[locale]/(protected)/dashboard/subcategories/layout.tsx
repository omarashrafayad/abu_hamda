import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Subcategories',
  description: 'Subcategories List Page'
}
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
    </>
  );
};

export default Layout;
