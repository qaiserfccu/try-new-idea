import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";

export const metadata: Metadata = {
  title: "ChiltanPure - Organic & Natural Products Store",
  description: "Shop organic skincare, haircare, essential oils, natural food products, and wellness items at ChiltanPure. Premium quality organic products with fast delivery and COD available.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
