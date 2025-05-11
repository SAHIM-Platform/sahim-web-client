import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      <Header />
      <Container medium>
        {children}
      </Container>
      <Footer />
    </div>
  );
} 