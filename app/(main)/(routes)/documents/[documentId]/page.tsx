import { ClientDocumentPage } from "./ClientDocumentPage";

interface Params {
  documentId: string;
}

type Props = {
  params: Params;
};

// Mark as async to satisfy Next.js
const Page = async ({ params }: Props) => {
  return <ClientDocumentPage documentId={params.documentId} />;
};

export default Page;
