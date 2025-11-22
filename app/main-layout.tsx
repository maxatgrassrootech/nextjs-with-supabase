"use client";

import RootNavBar from "@/components/root-nav-bar";
import { useState } from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <RootNavBar isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className={isOpen ? "mt-32" : ""}>{children}</main>
    </>
  );
}
