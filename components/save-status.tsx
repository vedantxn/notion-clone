"use client";

import { Check, Loader2, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SaveStatus as Status } from "@/hooks/use-debounced-save";

interface SaveStatusProps {
    status: Status;
    className?: string;
}

export const SaveStatus = ({ status, className }: SaveStatusProps) => {
    if (status === "idle") return null;

    return (
        <div
            className={cn(
                "flex items-center gap-x-1.5 text-xs text-muted-foreground select-none",
                status === "error" && "text-rose-500",
                className
            )}
        >
            {status === "saving" && (
                <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving…</span>
                </>
            )}
            {status === "saved" && (
                <>
                    <Check className="h-3.5 w-3.5" />
                    <span>Saved</span>
                </>
            )}
            {status === "error" && (
                <>
                    <TriangleAlert className="h-3.5 w-3.5" />
                    <span>Error saving</span>
                </>
            )}
        </div>
    );
};
