import { ContributionDetails  } from "../logic/AccountContributionsLogic";
import { shallow } from "zustand/shallow";
import { RFState, useStore } from "../store/store";


const selector = (state: RFState) => ({
    contributionDetails: state.contributionDetails,
})

export const ContributionDetailsPage = () => {
    const { contributionDetails } = useStore(selector, shallow)

    return (
      <div className="contribution-details">
        <h2>Contribution Details</h2>
        <div className="detail">
          <strong>Traditional 401k:</strong> ${contributionDetails?.traditional401k.toFixed(2)}
        </div>
        <div className="detail">
          <strong>Roth 401k:</strong> ${contributionDetails?.roth401k.toFixed(2)}
        </div>
        <div className="detail">
          <strong>Traditional IRA:</strong> ${contributionDetails?.traditionalIra.toFixed(2)}
        </div>
        <div className="detail">
          <strong>Roth IRA:</strong> ${contributionDetails?.rothIra.toFixed(2)}
        </div>
        <div className="detail">
          <strong>Estimated Tax Savings:</strong> ${contributionDetails?.estimatedTaxSavings.toFixed(2)}
        </div>
        <div className="detail">
          <strong>Estimated Extra Cash:</strong> ${contributionDetails?.estimatedExtraCash.toFixed(2)}
        </div>
      </div>
    );
  };
