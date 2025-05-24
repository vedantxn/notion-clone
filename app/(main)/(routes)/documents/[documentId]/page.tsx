"use client";

import { Toolbar } from "@/app/(main)/_components/toolbar";
import { Editor } from "@/components/editor";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface Params {
  documentId: string;
}

const Page = async ({ params }: { params: Params }) => {
  // You *cannot* use hooks in async functions,
  // so move logic that uses hooks to a Client Component instead.

  // So mark this component as Server Component,
  // but since you have "use client", you might want to
  // split your component between server + client parts.

  // For now, your error is about typing,
  // but Next.js expects page components to be sync
  // when using 'use client'

  // So: Either make this a Client Component and
  // accept params as props typed as any or unknown,
  // or remove "use client" and do data fetching here.

  return <ClientDocumentPage documentId={params.documentId} />;
};

export default Page;

// Client-side component
"use client";
import React from "react";

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
        <Toolbar initialData={document} />
        <Editor onChange={onChange} initialContent={content} />
      </div>
    </div>
  );
}
