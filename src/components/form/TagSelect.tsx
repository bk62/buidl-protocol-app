import CreatableSelect from 'react-select/creatable';
import { chakra } from '@chakra-ui/react';

const ChakraCreatableSelect = chakra(CreatableSelect)

export default function TagSelectField(props) {
    return (
        <ChakraCreatableSelect
            h={8}
            shadow={0}
            w="full"
            outline="2px solid transparent"
            placeholder="Select or create tags"
            borderRadius={"md"}
            borderColor={"transparent"}
            backgroundColor={"gray.100"}
            rounded="md"
            id="tags"
            name="tags"
            fontSize="14px"
            isMulti
            styles={styles}
            {...props}
        />
    )
}


const styles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: "#F7FAFC",
        color: "black",
        borderColor: "rgba(0,0,0,0)",
        boxShadow: 'none',
        "&:hover": {
            borderColor: "#48BB78",
            border: "2px solid #48BB78"
        }
    }),
    valueContainer: (provided, state) => ({
        ...provided,
        paddingTop: 0,
        paddingBottom: 0
    }),
    multiValue: (provided, state) => ({
        ...provided,
        marginTop: 0,
        marginBottom: 0
    }),
    multiValueLabel: (provided, state) => ({
        ...provided,
        backgroundColor: "#CBD5E0",
        color: "black",
    }),
    multiValueRemove: (provided, state) => ({
        ...provided,
        backgroundColor: "#CBD5E0",
        color: "black",
    }),
    menu: (provided, state) => ({
        ...provided,
        backgroundColor: "#F7FAFC",
        color: "black",
    }),
}