"use client";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/spinner";
import Link  from "next/link";
import { useConvexAuth } from "convex/react";

export const Navbar = () => {
    const { isAuthenticated, isLoading } = useConvexAuth();
    const scrollTop = useScrollTop();

    return (
        <div className={cn(
            "z-50 fixed bg-background top-0 flex items-center w-full p-6", scrollTop && "border-b shadow-sm")}>
            <Logo/>
            <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
                {isLoading &&  (
                    <Spinner/>
                )}

                {!isAuthenticated && !isLoading && (
                    <>
                    <SignInButton mode="modal">
                        <Button variant="ghost">
                            Sign In
                        </Button>
                    </SignInButton>
                    <SignInButton mode="modal">
                        <Button className="hover:bg-gray-100 hover:text-black">
                            Get Paperly Free
                        </Button>
                    </SignInButton>
                    </>
                )}
                {isAuthenticated && !isLoading && (
                    <>
                    <Button className="hover:bg-gray-100 hover:text-black">
                        <Link href="/notion-library">
                            My Pages
                        </Link>
                    </Button>
                    <UserButton
                        afterSignOutUrl="/"
                    />
                    </>
                )}  
            </div>
        </div>
    )
}
