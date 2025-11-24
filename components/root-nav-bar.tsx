"use client";

import Link from "next/link";
import { Suspense } from "react";
import { EnvVarWarning } from "./env-var-warning";
import { hasEnvVars } from "@/lib/utils";
import { AuthButton } from "./auth-button";
import { Button } from "./ui/button";

export default function RootNavBar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Button
            asChild
            size="sm"
            variant={"outline"}
            className="hidden md:flex"
          >
            <Link href={"/"}>Home</Link>
          </Button>
        </div>
        <div className="flex-1 flex justify-center items-center gap-5 font-semibold"></div>
        <div className="hidden md:flex">
          {!hasEnvVars ? (
            <EnvVarWarning />
          ) : (
            <Suspense>
              <Button
                asChild
                size="sm"
                variant={"outline"}
                className="hidden md:flex"
              >
                <Link href={"/protected/members"}>View Members</Link>
              </Button>
              &nbsp;
              <AuthButton />
            </Suspense>
          )}
        </div>
        <div className="md:hidden">
          <Button onClick={() => setIsOpen(!isOpen)} variant="outline">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b p-4 z-10">
          <div className="flex flex-col items-center gap-4">
            <Button asChild variant="ghost">
              <Link
                href={"/"}
                className="py-2 px-3 flex rounded-md no-underline bg-white hover:bg-gray-100 border border-gray-200"
              >
                Home
              </Link>
            </Button>

            <Suspense>
              <Button asChild variant="ghost">
                <Link
                  href={"/protected/members"}
                  className="py-2 px-3 flex rounded-md no-underline bg-white hover:bg-gray-100 border border-gray-200"
                >
                  View Members
                </Link>
              </Button>
              &nbsp;
              <AuthButton />
            </Suspense>
          </div>
        </div>
      )}
    </nav>
  );
}
