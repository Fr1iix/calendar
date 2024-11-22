import type { Metadata } from "next";
import "./globals.css";
import Header from "./Header/Header";
import React from "react";
import CompetitionCalendar from "@/app/CompetitionCalendar/CompetitionCalendar";


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
      <body>
      <Header/>
      {children}
      <CompetitionCalendar />
      </body>
      </body>
      </html>

  );
}
