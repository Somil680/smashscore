import Navbar from "@/components/Navbar";
import React from "react";
// import "../../global.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex flex-col">
        <Navbar />
        {children}
        </main>
   
  );
}