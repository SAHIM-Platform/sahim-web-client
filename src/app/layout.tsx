import { IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { Toaster } from "react-hot-toast";
import { Metadata } from "next";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "600", "700"],
  variable: "--font-family-ar",
});

export const metadata: Metadata = {
  title: 'SAHIM - Student Academic Hub for Integrated Management',
  description: 'منصة أكاديمية متكاملة لطلاب كلية السعيد للهندسة وتقنية المعلومات في جامعة تعز',
  keywords: ['SAHIM', 'منصة الطلاب', 'الإدارة الأكاديمية', 'جامعة تعز', 'التعليم'],
  authors: [{ name: 'فريق SAHIM' }],
  creator: 'منصة SAHIM',
  openGraph: {
    title: 'SAHIM - Student Academic Hub for Integrated Management',
    description: 'منصة أكاديمية شاملة لطلاب كلية السعيد للهندسة وتقنية المعلومات في جامعة تعز',
    url: 'https://sahimplatform.vercel.app/',
    siteName: 'منصة SAHIM',
    locale: 'ar_YE',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'SAHIM Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SAHIM - Student Academic Hub for Integrated Management',
    description: 'منصة أكاديمية شاملة لطلاب كلية السعيد للهندسة وتقنية المعلومات في جامعة تعز',
    images: ['/og.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${ibmPlexSansArabic.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
        <Toaster position="bottom-center" />
      </body>
    </html>
  );
}
