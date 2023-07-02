import { ipfs } from "@utils";
import axios from "axios";
import useSWR from "swr";

export const ipfsFetcher = async <T>(ipfsURI: string): Promise<T> =>
  (await axios.get(ipfs(ipfsURI))).data;

const useIPFS = <T>(uri?: string | null | false): [T | undefined, Error] => {
  const { data, error } = useSWR(uri || null, ipfsFetcher<T>, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return [data, error];
};

export default useIPFS;
