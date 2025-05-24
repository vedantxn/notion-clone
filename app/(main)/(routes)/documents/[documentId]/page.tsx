import { ClientDocumentPage } from "./ClientDocumentPage";

interface Params {
  documentId: string;
}

const Page = ({ params }: { params: Params }) => {
  return <ClientDocumentPage documentId={params.documentId} />;
};

export default Page;
