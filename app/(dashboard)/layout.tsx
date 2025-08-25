import { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/ui/customComponents/Navbar";
import { Toaster } from "react-hot-toast";
const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${poppins.className} flex  w-screen h-screen`}>
        <Toaster />
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
