import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./context/CartContext";

export const metadata: Metadata = {
  title: "GymLab - Premium Gymnastics Equipment",
  description: "Discover premium gymnastics equipment and accessories at GymLab. Shop high-quality mats, bars, beams, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
