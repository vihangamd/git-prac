import type { Metadata } from "next";
import "./globals.css";
import Header from "@/component/header";
import Footer from "@/component/footer";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow bg-stone-100">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
