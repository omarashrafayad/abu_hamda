import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abu hamda",
  description: "Abu hamda dashboard.",
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
