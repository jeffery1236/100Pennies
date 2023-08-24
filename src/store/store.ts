import { create } from "zustand";
import { ContributionDetails } from "../logic/AccountContributionsLogic"

export type RFState = {
    contributionDetails: ContributionDetails | undefined;
    setContributionDetails: (contributionDetails: ContributionDetails) => void;
};


export const useStore = create<RFState>((set, get) => ({
    contributionDetails: undefined,

    setContributionDetails: (contributionDetails: ContributionDetails) => {
        set({
            contributionDetails: contributionDetails
        })
    }
}));
