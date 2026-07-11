"use client";

import Image from "next/image";
import { useUser } from "@/lib/fake-clerk";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner"

const DocumentsPage = () => {

    const { user } = useUser();
    const create = useMutation(api.documents.create);

    const onCreate = () => {
        const promise = create({ title: "untitled" });

        toast.promise(promise, {
            loading: "Creating a new document...",
            success: "New Document created!",
            error: "Error creating document",
        });
    };

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

            <Button onClick={onCreate} className="hover:bg-gray-100 hover:text-black">
                <PlusCircle className="h-4 w-4 mr-1" size={16}/>
                Create Page
            </Button>
        </div>
    );
}   

export default DocumentsPage;