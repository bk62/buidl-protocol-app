import { ProfileTypeEnum } from "../hooks/useBuidlHub/types";



export function getProfileTypeBadge(type) {
    const typeName = ProfileTypeEnum[type];
    let typeColor = "blue";
    let typeVariant = "subtle"
    if (typeName == "Balaji") {
        typeColor = "purple";
        typeVariant = "outline"
    }
    else if (["SatanicCult", "MadScientist"].includes(typeName)) {
        typeColor = "red";
        typeVariant = "solid"
    }
    return {
        typeName, typeColor, typeVariant
    };
}