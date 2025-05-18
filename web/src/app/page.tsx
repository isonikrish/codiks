"use client"
import React from "react";
import { Button } from "@/components/ui/button"; // shadcn button import
import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)] grid grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 bg-gradient-to-b">

      <main className="flex flex-col gap-8 row-start-2 items-center max-w-xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Codiks
        </h1>
        <p className="text-lg leading-relaxed">
          Codiks is a real-time coding battle platform where developers face off to solve coding challenges under time pressure.
        </p>
        <Link href="/waiting-area">
          <Button
            className=" h-12 px-8 rounded-full font-semibold"
          >
            Battle
          </Button>
        </Link>
      </main>

      <footer className="row-start-3 text-sm text-white/70 text-center">
        &copy; 2025 Codiks — All rights reserved.
      </footer>
    </div>
  );
}
