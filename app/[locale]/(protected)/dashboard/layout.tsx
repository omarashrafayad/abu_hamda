import PageTitle from "@/components/page-title";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Abu Hamda",
  description: "Abu Hamda Dashboard.",
};
const Layout = ({ children }: { children: React.ReactNode }) => {
  return <>
    {children}
    </>;
};

export default Layout;