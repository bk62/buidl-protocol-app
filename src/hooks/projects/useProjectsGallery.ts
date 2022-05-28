import { useQuery } from "react-query";
import useBuidlHub from "../useBuidlHub";

const useProjectsGallery = ({ filters }) => {
    const hub = useBuidlHub();

    return useQuery(
        ["projects"], () => hub.getProjects(filters)
    )

}

export default useProjectsGallery;