"use client";

import { Toolbar } from "@/app/(main)/_components/toolbar";
import { Editor } from "@/components/editor";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { useCallback, useEffect, useRef, useState } from "react";

interface DocumentIdProps {
  params: {
    documentId: string;
  };
}

const DocumentId = ({ params }: DocumentIdProps) => {
  const documentId = params.documentId as Id<"documents">;
  const document = useQuery(api.documents.getById, { documentId });
  const update = useMutation(api.documents.update);

  const [content, setContent] = useState<string | null>(null);
  const initialized = useRef(false);

  // Set initial content only once when document loads
  useEffect(() => {
    if (document && !initialized.current) {
      setContent(document.content || "");
      initialized.current = true;
    }
  }, [document]);

  const onChange = useCallback((newContent: string) => {
    setContent(newContent);

    // Only trigger update if document is loaded
    if (document) {
      update({
        id: documentId,
        content: newContent
      });
    }
  }, [update, document, documentId]);

  if (document === undefined || content === null) {
    return <div>Loading...</div>;
  }

  if (document === null) {
    return <div>Document not found</div>;
  }

  return (
    <div className="pb-40">
      <div className="h-[35vh]" />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar initialData={document} />
        <Editor 
          editable={false} 
          onChange={onChange} 
          initialContent={content} 
        />
      </div>
    </div>
  );
};

export default DocumentId;
