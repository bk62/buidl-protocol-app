

// Profile types

export enum ProfileTypeEnum {
    Individual,
    Team,
    Startup,
    NonProfit,
    ProtoDAO,
    DAO,
    Anonymous,
    MadScientist,
    SatanicCult,
    Balaji
}


export const ProfileTypeMapping: Record<ProfileTypeEnum, string> = {
    [ProfileTypeEnum.Individual]: "Individual",
    [ProfileTypeEnum.Team]: "Team",
    [ProfileTypeEnum.Startup]: "Startup",
    [ProfileTypeEnum.NonProfit]: "NonProfit",
    [ProfileTypeEnum.ProtoDAO]: "ProtoDAO",
    [ProfileTypeEnum.DAO]: "DAO",
    [ProfileTypeEnum.Anonymous]: "Anonymous",
    [ProfileTypeEnum.MadScientist]: "MadScientist",
    [ProfileTypeEnum.SatanicCult]: "SatanicCult",
    [ProfileTypeEnum.Balaji]: "Balaji"
}



// Project types

export enum ProjectTypeEnum {
    // Software
    Tool,
    Prototype,
    App,
    Platform,
    // Art
    Art,
    // Greater good
    PublicGood,
    // Greater evil
    WorldDomination,
    // Start something
    ProtoDAO,
    Startup,
    NonProfit
}

export const ProjectTypeMapping: Record<ProjectTypeEnum, string> = {
    // Software
    [ProjectTypeEnum.Tool]: "Tool",
    [ProjectTypeEnum.Prototype]: "Prototype",
    [ProjectTypeEnum.App]: "App",
    [ProjectTypeEnum.Platform]: "Platform",
    // Art
    [ProjectTypeEnum.Art]: "Art",
    // Greater good
    [ProjectTypeEnum.PublicGood]: "PublicGood",
    // Greater evil
    [ProjectTypeEnum.WorldDomination]: "WorldDomination",
    // Start something
    [ProjectTypeEnum.ProtoDAO]: "ProtoDAO",
    [ProjectTypeEnum.Startup]: "Startup",
    [ProjectTypeEnum.NonProfit]: "NonProfit",
}


// Project sizes
export enum ProjectSizeEnum {
    Tiny,
    Small,
    Medium,
    Large,
    Giga,
    GoogleKiller,
    LandOnMars,
    DeathStar
}

export const ProjectSizeMapping: Record<ProjectSizeEnum, string> = {
    [ProjectSizeEnum.Tiny]: "Tiny",
    [ProjectSizeEnum.Small]: "Small",
    [ProjectSizeEnum.Medium]: "Medium",
    [ProjectSizeEnum.Large]: "Large",
    [ProjectSizeEnum.Giga]: "Giga",
    [ProjectSizeEnum.GoogleKiller]: "GoogleKiller",
    [ProjectSizeEnum.LandOnMars]: "LandOnMars",
    [ProjectSizeEnum.DeathStar]: "DeathStar"
}

// Project state
export enum ProjectStateEnum {
    // Creation stages vs stages to update to -- TODO
    HalfBaked,
    Brainstorm,
    Planning,
    Design,
    Development,
    Testing,
    Launch,
    Operations,
    Growth,
    Success,
    ProtoDAO,
    DAO,
    Terminal,
    Closed
}

export const ProjectStateMapping: Record<ProjectStateEnum, string> = {
    [ProjectStateEnum.HalfBaked]: "HalfBaked",
    [ProjectStateEnum.Brainstorm]: "Brainstorm",
    [ProjectStateEnum.Planning]: "Planning",
    [ProjectStateEnum.Design]: "Design",
    [ProjectStateEnum.Development]: "Development",
    [ProjectStateEnum.Testing]: "Testing",
    [ProjectStateEnum.Launch]: "Launch",
    [ProjectStateEnum.Operations]: "Operations",
    [ProjectStateEnum.Growth]: "Growth",
    [ProjectStateEnum.Success]: "Success",
    [ProjectStateEnum.ProtoDAO]: "ProtoDAO",
    [ProjectStateEnum.DAO]: "DAO",
    [ProjectStateEnum.Terminal]: "Terminal",
    [ProjectStateEnum.Closed]: "Close"
}