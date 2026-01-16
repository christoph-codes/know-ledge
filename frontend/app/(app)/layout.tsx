import "../globals.css";
import { HeaderNav } from "@/shared/ui/HeaderNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HeaderNav />
      <div className={"gap-2.5 px-14"}>{children}</div>
    </>
  );
}
