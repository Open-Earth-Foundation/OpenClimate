import { PledgeTargetType } from "./pledge-target-types";

export const PledgeTargets = [
    {
        type: PledgeTargetType.TargetEmissions,
        name: "Target emissions",
        fields: [
            { fieldName: "Emission level" }
        ]
    },
    {
        type: PledgeTargetType.TargetReduction,
        name: "Target reduction",
        fields: [
            { fieldName: "% reduction" },
            { fieldName: "Base year" },
            { fieldName: "Base level" }
        ]
    },
    {
        type: PledgeTargetType.TargetCarbonIntensity,
        name: "Target carbon intensity",
        fields: [
            { fieldName: "Carbon intensity level" }
        ]
    },
    {
        type: PledgeTargetType.TargetCarbonIntensityReduction,
        name: "Target carbon intensity reduction",
        fields: [
            { fieldName: "% reduction" },
            { fieldName: "Base year" },
            { fieldName: "Base level" }
        ]
    }

];