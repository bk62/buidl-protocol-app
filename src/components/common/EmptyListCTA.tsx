import { Button, Text, Flex } from "@chakra-ui/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'


const EmptyListCTA = ({ icon = faPlus, cta = "Create" }) => {
    return (
        <Button
            p='0px'
            bg='transparent'
            color='gray.400'
            border='1px solid'
            borderColor="gray.400"
            borderRadius='sm'
            minHeight={{ base: "200px" }}
            h="full" w="full"
            _hover={{
                borderColor: "gray.300",
                color: "gray.300"
            }}
        >

            <Flex direction='column' justifyContent='center' align='center'>
                {/* <Icon as={FaPlus} fontSize='lg' mb='12px' /> */}
                {!!icon && (
                    <Text fontSize='lg' mb='12px'
                    >
                        <FontAwesomeIcon icon={icon} />
                    </Text>
                )}
                <Text fontSize='lg' fontWeight='bold'
                >
                    {cta}
                </Text>
            </Flex>
        </Button>
    )
}


export default EmptyListCTA;