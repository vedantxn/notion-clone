"use client";

import { useUser,SignOutButton } from "@clerk/clerk-react";
import { ChevronsLeftRight } from "lucide-react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { DropdownMenu,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuContent } from "@/components/ui/dropdown-menu";



export const UserItems = () => {

    const { user } = useUser();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div role="button" className="flex items-center text-sm p-3 w-full hover:bg-primary/5">
                    <div className="gap-x-2 items-center flex max-w-[150px]">
                        <Avatar className="h- w-10">
                            <AvatarImage src={user?.imageUrl} alt="User" />
                        </Avatar>
                        <span className="text-start font-medium line-clamp-1">
                            {user?.fullName}&apos;s Notebook
                        </span>
                    </div>
                    <ChevronsLeftRight className="rotate-90 ml-2 text-muted-foreground h-4 w-4" size={16} />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="start" alignOffset={11} forceMount>
    <DropdownMenuItem className="flex items-center gap-3 px-3 py-2 cursor-default hover:bg-transparent">
        <Avatar className="h-8 w-8 rounded-full">
            <AvatarImage src={user?.imageUrl} alt="User" />
        </Avatar>
        <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground line-clamp-1">
                {user?.fullName}&apos;s Notebook
            </span>
            <span className="text-xs text-muted-foreground line-clamp-1">
                {user?.emailAddresses[0]?.emailAddress}
            </span>
        </div>
    </DropdownMenuItem>

    {/* Separator */}
    <DropdownMenuSeparator />

    {/* Log Out Button */}
    <DropdownMenuItem className="px-3 py-2">
        <SignOutButton>
        <button className="text-red-600 hover:text-red-700 text-sm py-1 px-3 rounded-md bg-transparent">
            Log Out
        </button>
        </SignOutButton>
    </DropdownMenuItem>
</DropdownMenuContent>
</DropdownMenu>
    );
}