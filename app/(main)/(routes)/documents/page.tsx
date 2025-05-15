"use client";

import Image from "next/image";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

const DocumentsPage = () => {

    const { user } = useUser();

    return (
        <div className="flex flex-col items-center justify-center h-full space-y-4">
            <Image 
                src="/Planning-A-Trip.png"
                height="300"
                width="300"
                alt="Empty"
            />
            
            <h2 className="text-lg font-medium"> 
                Welcome to {user?.firstName}&apos;s Notebook!
            </h2>

            <Button className="hover:bg-gray-100 hover:text-black">
                <PlusCircle className="h-4 w-4 mr-1" size={16}/>
                Create Document
            </Button>
        </div>
    );
}   

export default DocumentsPage;