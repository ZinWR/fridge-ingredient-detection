import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fridge Ingredient Detection",
  description: "Snellito Labs Take Home",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
