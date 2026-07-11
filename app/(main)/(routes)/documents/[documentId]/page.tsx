import { ClientDocumentPage } from "./ClientDocumentPage";

interface Params {
  documentId: string;
}

const Page = async ({ params }: { params: Promise<Params> }) => {
  const resolvedParams = await params;
  // Key by documentId so switching documents fully remounts the client tree —
  // editor resets, pending saves flush to the correct doc, no content leakage.
  return (
    <ClientDocumentPage
      key={resolvedParams.documentId}
      documentId={resolvedParams.documentId}
    />
  );
};

export default Page;
