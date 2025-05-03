import AppLayoutContent from "@/components/App/AppLayoutContent";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AppLayoutContent>{children}</AppLayoutContent>;
} 