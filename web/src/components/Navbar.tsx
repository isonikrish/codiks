"use client"
import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useApp } from "@/stores/useApp";
import { Swords } from "lucide-react";

export default function Navbar() {
    const { user } = useApp();

    return (
        <nav className=" border-b p-3 fixed left-0 right-0 bg-card flex justify-between items-center">
            <div className="flex gap-6 items-center">
                <Link className="text-xl cursor-pointer px-3 " href={'/'}>
                    Codiks
                </Link>
                <Link href={'/battle'} className="flex gap-2 items-center underline">
                    <Swords size={17}/>
                    battle
                </Link>
            </div>
            {user ?
                <Button>Logout</Button>
                :
                <div className="flex gap-2">
                    <Link href={'/login'}>
                        <Button variant={"outline"}>Login</Button>
                    </Link>
                    <Link href={'/signup'}>
                        <Button>Signup</Button>
                    </Link>
                </div>
            }
        </nav>
    );
}