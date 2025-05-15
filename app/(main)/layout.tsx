"use client";

import { Spinner } from "@/components/spinner";
import { useConvexAuth } from "convex/react";
import { Navigation } from "./_components/navigation";
import { redirect } from "next/navigation";


const MainLayout = ({ children }: { children: React.ReactNode }) => {

    const { isAuthenticated, isLoading } = useConvexAuth();

    if(isLoading) {
        return (
             <div className="flex justify-center items-center h-full">
                <Spinner size="md"/>
             </div>
        )
    }

    if(!isAuthenticated) {
        return redirect("/");
        
    }

    return (
        <div className="flex h-full">
            <Navigation/>
            <main className="flex-1 overflow-y-auto h-full">
                {children}
            </main>
        </div>

    );
}

export default MainLayout;