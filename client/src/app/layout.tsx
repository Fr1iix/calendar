import type { Metadata } from "next";
import "./globals.css";
import Header from "./Header/Header";
import Footer from "./components/Footer"; // Импортируйте ваш футер
import React from "react";

export const metadata: Metadata = {
    title: "Calendar",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        <body>
        <Header />
        {children}
        <Footer />
        </body>
        </html>
    );
}