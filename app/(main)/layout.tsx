"use client";

import { Spinner } from "@/components/spinner";
import { Navigation } from "./_components/navigation";
import { redirect } from "next/navigation";
import { SearchCommand } from "@/components/search-command";


const MainLayout = ({ children }: { children: React.ReactNode }) => {

    const { isAuthenticated, isLoading } = { isAuthenticated: true, isLoading: false }; // LOCAL PREVIEW BYPASS

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
                <SearchCommand />
                {children}
            </main>
        </div>

    );
}

export default MainLayout;