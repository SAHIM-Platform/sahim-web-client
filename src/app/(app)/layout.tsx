import AppLayoutContent from "@/components/OnlyApp/AppLayoutContent";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppLayoutContent>{children}</AppLayoutContent>;
} 