import { SiteFooter } from "@/components/site-footer";
import { SiteFooterCredit } from "@/components/site-footer-credit";
import { SiteHeader } from "@/components/site-header";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="max-w-screen overflow-x-hidden px-2">{children}</main>
      <SiteFooter />
      <SiteFooterCredit />
    </>
  );
}
