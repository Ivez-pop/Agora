import AccountBar from "../account-bar";
import SiteFooter from "../site-footer";

export default function BookshelfLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AccountBar />
      {children}
      <SiteFooter />
    </>
  );
}
