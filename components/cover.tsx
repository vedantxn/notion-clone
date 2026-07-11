"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ImageIcon, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useMutation } from "convex/react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCoverImage } from "@/hooks/use-cover-image";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface CoverProps {
    url?: string;
    preview?: boolean;
}

export const Cover = ({ url, preview }: CoverProps) => {
    const coverImage = useCoverImage();
    const removeCover = useMutation(api.documents.removeCover);
    const params = useParams();

    // Reset the error state whenever the cover URL changes.
    const [failed, setFailed] = useState(false);
    useEffect(() => {
        setFailed(false);
    }, [url]);

    const onRemove = () => {
        if (!params.documentId) return;
        removeCover({ id: params.documentId as Id<"documents"> });
    };

    return (
        <div
            className={cn(
                "relative w-full group",
                !url && "h-[12vh]",
                url && "bg-muted h-[35vh]"
            )}
        >
            {!!url && !failed && (
                <Image
                    src={url}
                    fill
                    alt="Cover"
                    className="object-cover"
                    sizes="100vw"
                    priority
                    // Arbitrary user URLs: skip the optimizer for reliability.
                    unoptimized
                    onError={() => setFailed(true)}
                />
            )}

            {!!url && failed && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-1 text-muted-foreground">
                    <ImageIcon className="h-6 w-6" />
                    <p className="text-xs">Cover image couldn&apos;t be loaded</p>
                </div>
            )}

            {url && !preview && (
                <div className="opacity-0 group-hover:opacity-100 transition absolute bottom-5 right-5 flex items-center gap-x-2">
                    <Button
                        onClick={() => coverImage.onReplace(url)}
                        className="text-muted-foreground text-xs"
                        variant="secondary"
                        size="sm"
                    >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Change cover
                    </Button>
                    <Button
                        onClick={onRemove}
                        className="text-muted-foreground text-xs"
                        variant="secondary"
                        size="sm"
                    >
                        <X className="h-4 w-4 mr-2" />
                        Remove
                    </Button>
                </div>
            )}
        </div>
    );
};

Cover.Skeleton = function CoverSkeleton() {
    return <Skeleton className="w-full h-[12vh]" />;
};
