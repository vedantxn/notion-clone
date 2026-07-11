"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Toolbar } from "@/app/(main)/_components/toolbar";
import { Cover } from "@/components/cover";
import { Skeleton } from "@/components/ui/skeleton";
import { getCoverImage } from "@/lib/utils";

interface ClientPreviewPageProps {
    documentId: string;
}

export function ClientPreviewPage({ documentId }: ClientPreviewPageProps) {
    const document = useQuery(api.documents.getById, {
        documentId: documentId as Id<"documents">,
    });

    const Editor = useMemo(
        () =>
            dynamic(() => import("@/components/editor").then((m) => m.Editor), {
                ssr: false,
            }),
        []
    );

    if (document === undefined) {
        return (
            <div className="pb-40">
                <Cover.Skeleton />
                <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10 space-y-4 pl-8">
                    <Skeleton className="h-14 w-1/2" />
                    <Skeleton className="h-4 w-[80%]" />
                    <Skeleton className="h-4 w-[40%]" />
                </div>
            </div>
        );
    }

    // getById only returns a document publicly when isPublished && !isArchived
    // (otherwise it is null for non-owners). So this covers unavailable pages.
    if (document === null) {
        return (
            <div className="h-full flex flex-col items-center justify-center gap-y-3 text-center px-6">
                <h2 className="text-lg font-medium">This page isn&apos;t available</h2>
                <p className="text-sm text-muted-foreground max-w-sm">
                    It may be private or no longer published.
                </p>
            </div>
        );
    }

    const cover = getCoverImage(document);

    return (
        <div className="pb-40">
            {cover ? <Cover preview url={cover} /> : <div className="h-[12vh]" />}
            <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
                <Toolbar preview initialData={document} />
                <Editor editable={false} initialContent={document.content} />
            </div>
        </div>
    );
}
