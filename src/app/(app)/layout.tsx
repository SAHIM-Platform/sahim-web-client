import AppLayoutContent from "@/components/app/AppLayoutContent";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppLayoutContent>{children}</AppLayoutContent>;
} 