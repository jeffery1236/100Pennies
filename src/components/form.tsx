import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { shallow } from "zustand/shallow";
import { RFState, useStore } from "../store/store";
import { getContributionDetails } from "../logic/AccountContributionsLogic"

const selector = (state: RFState) => ({
  setContributionDetails: state.setContributionDetails
})

export type FormData = {
  baseSalary: number;
  yearlyBonus: number;
  federalTax: number;
  stateTax: number;
  localTax: number;
  has401kMatching: boolean;
  employerContribution: number;
  contributionCap: number;
  livingExpenses: number;
  cashSavings: number;
  becomeCitizen: boolean;
  withdrawWhileIncome: boolean;
};

export const Form = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const { setContributionDetails } = useStore(selector, shallow)

  const onSubmit = (data: FormData) => {
    const parsedData: FormData = {
      ...data,
      baseSalary: +data.baseSalary,
      yearlyBonus: +data.yearlyBonus,
      federalTax: +data.federalTax,
      stateTax: +data.stateTax,
      localTax: +data.localTax,
      livingExpenses: +data.livingExpenses,
      cashSavings: +data.cashSavings,
      employerContribution: data.has401kMatching ? +data.employerContribution : 0,
      contributionCap: data.has401kMatching ? +data.contributionCap : 0,
    };

    console.log(parsedData);
    const contributionDetails = getContributionDetails(parsedData) // getAccountContributions
    console.log(contributionDetails)

    setContributionDetails(contributionDetails)
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Gross Income from employer:</h2>
      <label>
        What is your yearly base salary?
        <input
          type="number"
          {...register('baseSalary')}
          defaultValue={150000}
        />
      </label> <br/>
      <label>
        What is your yearly bonus?
        <input
          type="number"
          {...register('yearlyBonus')}
          defaultValue={0}
        />
      </label>

      <h2>Taxes:</h2>
      <label>
        Estimated Federal Income tax?
        <input
          type="number"
          {...register('federalTax')}
          defaultValue={29400}
        />
      </label> <br/>
      <label>
        Estimated State Income tax?
        <input
          type="number"
          {...register('stateTax')}
          defaultValue={0}
        />
      </label><br/>
      <label>
        Estimated Local tax?
        <input
          type="number"
          {...register('localTax')}
          defaultValue={0}
        />
      </label>

      <h2>401k:</h2>
      <label>
        Does your employer offer 401(k) matching?
        <input type="checkbox" {...register('has401kMatching')} />
      </label><br/>
      <label>
      <label>
        How much is the matching capped? (at % of your base salary)
        <input
          type="number"
          {...register('contributionCap')}
          defaultValue={4}
        />
      </label><br/>
        How much matching contribution does your employer provide? (In %)
        <input
          type="number"
          {...register('employerContribution')}
          defaultValue={50}
        />
      </label>

      <h2>Expenses and Savings</h2>
      <label>
        What is your estimated yearly living expenses?
        <input
          type="number"
          {...register('livingExpenses')}
          defaultValue={50000}
        />
      </label> <br/>
      <label>
        What is your target yearly liquid cash savings?
        <input
          type="number"
          {...register('cashSavings')}
          defaultValue={10000}
        />
      </label>

      <h2>Retirement:</h2>
      <label>
        Do you plan to become a US citizen or green card holder?
        <input type="checkbox" {...register('becomeCitizen')} />
      </label><br/>
      <label>
        Do you plan to start withdrawing money from retirement accounts while you have income?
        <input type="checkbox" {...register('withdrawWhileIncome')} />
      </label> <br/>

      <button type="submit">Submit</button>
    </form>
  );
}
