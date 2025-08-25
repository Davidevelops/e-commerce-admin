import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "../globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "400", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Anyo Login",
  description: "Log in to your Anyo account to see our new arrivals!",
};

export default function Authlayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${poppins.className}`}>
        <Toaster />
        <main>{children}</main>
      </body>
    </html>
  );
}
