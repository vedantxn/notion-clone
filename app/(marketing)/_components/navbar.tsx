"use client";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "./logo" 

export const Navbar = () => {
    const scrollTop = useScrollTop();

    return (
        <div className={cn(
            "z-50 fixed bg-background top-0 flex items-center w-full p-6", scrollTop && "border-b shadow-sm")}>
            <Logo/>
            <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
                Login
            </div>

        </div>
    )
}