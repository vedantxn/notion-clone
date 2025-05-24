"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface ClientDocumentPageProps {
  documentId: string;
}

export function ClientDocumentPage({ documentId }: ClientDocumentPageProps) {
  const documentIdTyped = documentId as Id<"documents">;
  const document = useQuery(api.documents.getById, { documentId: documentIdTyped });
  const update = useMutation(api.documents.update);

  const [content, setContent] = useState<string | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (document && !initialized.current) {
      setContent(document.content || "");
      initialized.current = true;
    }
  }, [document]);

  const onChange = useCallback((newContent: string) => {
    setContent(newContent);
    if (document) {
      update({ id: documentIdTyped, content: newContent });
    }
  }, [update, document, documentIdTyped]);

  if (document === undefined || content === null) return <div>Loading...</div>;
  if (document === null) return <div>Document not found</div>;

  return (
    <div className="pb-40">
      <div className="h-[35vh]" />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        {/* toolbar and editor here */}
      </div>
    </div>
  );
}
