"use client";

import { useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { useMutation, useQuery } from "convex/react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Cover } from "@/components/cover";
import { Toolbar } from "@/app/(main)/_components/toolbar";
import { SaveStatus } from "@/components/save-status";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebouncedSave } from "@/hooks/use-debounced-save";
import { getCoverImage } from "@/lib/utils";

interface ClientDocumentPageProps {
  documentId: string;
}

export function ClientDocumentPage({ documentId }: ClientDocumentPageProps) {
  const documentIdTyped = documentId as Id<"documents">;
  const document = useQuery(api.documents.getById, {
    documentId: documentIdTyped,
  });
  const update = useMutation(api.documents.update);

  // Editor is browser-only (BlockNote); never server-render it. Memoized so the
  // dynamic component identity is stable across re-renders.
  const Editor = useMemo(
    () =>
      dynamic(() => import("@/components/editor").then((m) => m.Editor), {
        ssr: false,
        loading: () => (
          <div className="pl-6 md:pl-[54px] pr-4 space-y-3">
            <Skeleton className="h-4 w-[60%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
          </div>
        ),
      }),
    []
  );

  // The save closure captures this page's documentId, so a flush during a page
  // switch always writes to the correct document — content can't leak across pages.
  const { status, schedule } = useDebouncedSave<string>(
    (content) => update({ id: documentIdTyped, content }),
    600
  );

  const onEditorChange = useCallback(
    (content: string) => schedule(content),
    [schedule]
  );

  if (document === undefined) {
    return <DocumentSkeleton />;
  }

  if (document === null) {
    return <DocumentNotFound />;
  }

  const cover = getCoverImage(document);

  return (
    <div className="pb-40">
      {cover ? <Cover url={cover} /> : <div className="h-[12vh]" />}

      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <div className="flex items-center justify-end px-6 md:px-[54px] h-6 pt-2">
          <SaveStatus status={status} />
        </div>

        <Toolbar initialData={document} />

        <Editor
          onChange={onEditorChange}
          initialContent={document.content}
          editable
        />
      </div>
    </div>
  );
}

const DocumentSkeleton = () => (
  <div className="pb-40">
    <Cover.Skeleton />
    <div className="md:max-w-3xl lg:max-w-4xl mx-auto mt-10">
      <div className="space-y-4 pl-8 pt-4">
        <Skeleton className="h-14 w-1/2" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-[40%]" />
        <Skeleton className="h-4 w-[60%]" />
      </div>
    </div>
  </div>
);

const DocumentNotFound = () => (
  <div className="h-full flex flex-col items-center justify-center gap-y-3 text-center px-6">
    <h2 className="text-lg font-medium">Page not found</h2>
    <p className="text-sm text-muted-foreground max-w-sm">
      This page doesn&apos;t exist, or you don&apos;t have access to it.
    </p>
  </div>
);
