import { ClientDocumentPage } from "./ClientDocumentPage";

interface Params {
  documentId: string;
}

const Page = async ({ params }: { params: Params }) => {
  return <ClientDocumentPage documentId={params.documentId} />;
};

export default Page;
