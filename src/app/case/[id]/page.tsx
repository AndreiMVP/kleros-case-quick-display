import DisputeDoc from "./DisputeDoc";
import { getSubgraphData, getJustifications, getMetaEvidence } from "./data";

export default async function Page({ params }: { params: { id: string } }) {
  const disputeId = params.id;

  const data = await getSubgraphData("Dispute", disputeId);
  const dispute = data?.dispute;
  const justifications = await getJustifications(+disputeId, 0);
  const metaEvidence = dispute?.arbitrableHistory?.metaEvidence
    ? await getMetaEvidence(dispute.arbitrableHistory.metaEvidence)
    : null;

  if (isNaN(+disputeId)) return <div>Invalid Dispute ID...</div>;
  if (!data) return <div>Loading...</div>;
  if (!dispute) return <div>Subgraph Error...</div>;

  return (
    <DisputeDoc
      disputeId={+disputeId}
      dispute={dispute}
      justifications={justifications}
      subgraphMetaEvidence={metaEvidence}
    />
  );
}
