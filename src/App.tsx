import { useState } from "react"
import { Form } from "./components/form"
import { ContributionDetailsPage } from "./components/ContributionDetailsPage";
import { shallow } from "zustand/shallow";
import { RFState, useStore } from "./store/store";

const selector = (state: RFState) => ({
  contributionDetails: state.contributionDetails,
})

export default function App() {
  const { contributionDetails } = useStore(selector, shallow);

  return (
    <div>
      {contributionDetails == undefined ? (
        <Form />
      ) : (
        <ContributionDetailsPage />
      )}
    </div>
  );
}
