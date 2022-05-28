import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
    Button
} from '@chakra-ui/react'
import { Help } from "../../icons";

export default function HelpPopover(props) {
    return (
        <Popover>
            <PopoverTrigger>
                <Button variant="outline" colorScheme="orange" borderRadius="50%" p={0}>?</Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>{props.header}</PopoverHeader>
                <PopoverBody>{props.text}</PopoverBody>
            </PopoverContent>
        </Popover>
    )
}