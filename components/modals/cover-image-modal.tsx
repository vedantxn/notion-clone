"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useMutation } from "convex/react";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCoverImage } from "@/hooks/use-cover-image";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

export const CoverImageModal = () => {
    const params = useParams();
    const update = useMutation(api.documents.update);
    const coverImage = useCoverImage();

    const [url, setUrl] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onClose = () => {
        setUrl("");
        setError(null);
        setIsSubmitting(false);
        coverImage.onClose();
    };

    // Accept only well-formed http(s) URLs.
    const isValidImageUrl = (value: string) => {
        try {
            const parsed = new URL(value);
            return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
            return false;
        }
    };

    const onSubmit = async () => {
        const trimmed = url.trim();
        if (!trimmed || !params.documentId) return;

        if (!isValidImageUrl(trimmed)) {
            setError("Enter a valid image URL (starting with http:// or https://).");
            return;
        }

        setError(null);
        setIsSubmitting(true);
        try {
            await update({
                id: params.documentId as Id<"documents">,
                coverImage: trimmed,
            });
            onClose();
        } catch {
            setError("Couldn't save the cover. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={coverImage.isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader className="border-b pb-3">
                    <DialogTitle className="text-center text-lg font-semibold">
                        {coverImage.url ? "Change cover" : "Add cover"}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex flex-col gap-y-3">
                    <Input
                        autoFocus
                        placeholder="Paste an image URL…"
                        value={url}
                        onChange={(e) => {
                            setUrl(e.target.value);
                            if (error) setError(null);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                void onSubmit();
                            }
                        }}
                    />
                    {error && (
                        <p className="text-xs text-rose-500">{error}</p>
                    )}
                    <Button
                        disabled={!url.trim() || isSubmitting}
                        onClick={onSubmit}
                    >
                        {coverImage.url ? "Replace cover" : "Add cover"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};
