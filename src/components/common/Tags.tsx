
import { Tag } from "@chakra-ui/react";

export default function Tags({ tags }) {
    if (!!!tags) {
        return <></>
    }
    return (
        <>
            {tags.map((tag) => {
                return <Tag key={tag.value}>{tag.label}</Tag>
            })
            }
        </>
    )

}