"use client";

import { ClerkProvider } from "@/lib/fake-clerk";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";


const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const ConvexClientProvider = ({ children }: { children: ReactNode }) => {
    return (
        <ClerkProvider>
            <ConvexProvider client={convex}>
                {children}
            </ConvexProvider>
        </ClerkProvider>
    );
};
