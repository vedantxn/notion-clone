"use client";

import { Spinner } from "@/components/spinner";
import { redirect } from "next/navigation";
import { useConvexAuth } from "convex/react";

// Gate the notion-library app behind auth, mirroring app/(main)/layout.tsx.
// Signed-out visitors (including anyone who pastes the URL directly) are sent
// back to the marketing page to sign in.
const NotionLibraryLayout = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoading } = useConvexAuth();

    if (isLoading) {
        return (
            <div className="flex h-dvh items-center justify-center">
                <Spinner size="md" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return redirect("/");
    }

    return <>{children}</>;
};

export default NotionLibraryLayout;
