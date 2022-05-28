import { useQuery } from "react-query";

import { readMetadataJSON, ipfsUrlToNftStorageUrl } from "../../utils/helpers";

// get metadata json and linked image url
const useIpfsMetadata = ({ metadataURI = "", handle, type = "profile" }) => {

    return useQuery(
        ["metadata_json", type, handle], async () => {
            const res = await readMetadataJSON(metadataURI)
            const data = res.data
            data.httpUrl = res.httpUrl
            data.imageHttpUrl = ipfsUrlToNftStorageUrl(data?.image)
            return data
        },
        {
            staleTime: 10e7, // never changes
            retry: false
        }
    )

}


export default useIpfsMetadata;