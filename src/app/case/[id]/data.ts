"use server";

import { EvidenceData, EvidenceFile } from "@components/EvidenceItem";
import { getSdk } from "@generated/graphql";
import { ipfsFetcher } from "@hooks/useIPFS";
import { justificationsLink } from "@utils";
import { Justification, MetaEvidenceFile } from "@utils/types";
import axios from "axios";
import { GraphQLClient } from "graphql-request";
import { cache } from "react";

const sdk = getSdk(
  new GraphQLClient(process.env.NEXT_PUBLIC_SUBGRAPH_ENDPOINT!)
);

export const getSubgraphData = cache(
  async (key: keyof typeof sdk, id: string) => await sdk[key]({ id })
);

const justificationsFetcher = async ([disputeId, appeal]: [
  number,
  number
]): Promise<Justification[]> =>
  (await axios.get(justificationsLink(disputeId, appeal))).data.payload
    .justifications;

export const getJustifications = cache(
  async (disputeId: number, appeal: number) =>
    await justificationsFetcher([disputeId, appeal])
);

export const getMetaEvidence = cache(
  async (metaEvidenceUri: string) =>
    await ipfsFetcher<MetaEvidenceFile>(metaEvidenceUri)
);

export const getEvidenceWithFiles = cache(async (evidence: EvidenceData[]) =>
  (
    await Promise.all(
      evidence.map((ev) =>
        ev.URI ? ipfsFetcher<EvidenceFile>(ev.URI) : undefined
      )
    )
  ).map((res, idx) => ({
    ...evidence[idx],
    file: res,
  }))
);
