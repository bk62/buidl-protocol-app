import Davatar from "@davatar/react";
import React from "react";
import { Button, Flex, Text, useColorModeValue, Box, Image, Grid, GridItem } from "@chakra-ui/react";


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { constants } from "ethers";

import Card from "../../common/Card";
import CardHeader from "../../common/CardHeader";
import CardContent from "../../common/CardContent";
import ProjectGalleryItem from "../../projects/ProjectGalleryItem"


const placeholder = {
    handle: "cool-proj",
    category: "tool",
    imageUrl: (id) => `https://picsum.photos/seed/${id}/500`,
    imageAlt: "Profile photo",
    title: "Web dev learning web3",
    about: "Longer paragraph description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    numBackers: 10,
    totalBackedAmount: 1000,
    numProjects: 2,
    totalInvestmentsInProjects: 200
}

const Project = ({ project }) => {
    return (
        <Flex direction='column'>
            <Box mb='20px' position='relative' borderRadius='15px'>
                <Image src={placeholder['imageUrl'](1)} borderRadius='15px' />
                <Box
                    w='100%'
                    h='100%'
                    position='absolute'
                    top='0'
                    borderRadius='15px'
                    bg='linear-gradient(360deg, rgba(49, 56, 96, 0.16) 0%, rgba(21, 25, 40, 0.88) 100%)'></Box>
            </Box>
            <Flex direction='column'>
                <Text fontSize='md' color='gray.500' fontWeight='600' mb='10px'>
                    {placeholder.handle}
                </Text>
                <Text fontSize='xl' color="color" fontWeight='bold' mb='10px'>
                    {placeholder.category}
                </Text>
                <Text fontSize='md' color='gray.500' fontWeight='400' mb='20px'>
                    {placeholder.about}
                </Text>
                <Flex justifyContent='space-between'>
                    <Button
                        // variant='outline'
                        colorScheme='blue'
                        // minW='110px'
                        h='36px'
                        fontSize='xs'
                        px='1.5rem'>
                        INVEST
                    </Button>
                    <Button
                        variant='outline'
                        colorScheme='gray'
                        // minW='110px'
                        h='36px'
                        fontSize='xs'
                        px='1.5rem'>
                        VIEW
                    </Button>
                    {/* <AvatarGroup size='xs'>
                        {avatars.map((el, idx) => {
                            return <Avatar src={el} key={idx} />;
                        })}
                    </AvatarGroup> */}
                </Flex>
            </Flex>
        </Flex>
    )
}


const Projects = ({ projects }) => {
    return (
        <Card p="16px" shadow="0" bg="bg.2" >
            <CardHeader p='12px 5px' mb='12px'>
                <Text fontSize='lg' color="text" fontWeight='bold'>
                    Projects
                </Text>
            </CardHeader>
            <CardContent px='5px'>
                <Grid
                    templateColumns={{ sm: "1fr", md: "1fr 1fr", lg: "repeat(3, 1fr)", xl: "repeat(4, 1fr)" }}
                    gap={6}
                >
                    {/* {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((project, ix) => (
                        <GridItem key={ix}>
                            <Project project={project} />
                        </GridItem>
                    ))} */}
                    {projects.map((project, ix) => {
                        return <GridItem key={ix}>
                            <ProjectGalleryItem project={project} />
                        </GridItem>
                    })}


                </Grid>
            </CardContent>
        </Card>
    )
}


export default Projects;