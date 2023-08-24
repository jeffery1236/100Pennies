import { FormData } from '../components/form'

export type ContributionDetails = {
    traditional401k: number;
    roth401k: number;
    traditionalIra: number;
    rothIra: number;
    estimatedTaxSavings: number; // not sure if this is valuable to show since we cant calculate state and local tax -> will use user input for now
    estimatedExtraCash: number; // not sure if this is valuable to show since we cant calculate state and local tax -> will use user input for now
}
export const getContributionDetails = (formData: FormData, limit401k: number = 22500, limitIra: number = 6500) => {
    const yearlyOTE = formData.baseSalary + formData.yearlyBonus
    const estimatedIncomeTaxBeforeSavings = formData.federalTax + formData.stateTax + formData.localTax
    const expenseAndSavings = formData.livingExpenses + formData.cashSavings // account for living expense and cash savings
    let employerMatch401k = 0
    let iraContribution = 0
    let taxBenefit401k = 0

    console.log(formData.baseSalary, formData.yearlyBonus)
    // console.log(formData.federalTax + formData.stateTax + formData.localTax)
    console.log(yearlyOTE, estimatedIncomeTaxBeforeSavings, expenseAndSavings)

    // employer match 401k
    if (formData.has401kMatching) {
        employerMatch401k = Math.min(Math.max(yearlyOTE - estimatedIncomeTaxBeforeSavings - expenseAndSavings, 0), formData.baseSalary * formData.contributionCap / 100.0)
    }

    console.log('employerMatch401k', employerMatch401k)

    // IRA
    iraContribution = Math.min(Math.max(yearlyOTE - estimatedIncomeTaxBeforeSavings - employerMatch401k, 0), limitIra)
    console.log('iraContribution', iraContribution)

    // tax benefit 401k
    taxBenefit401k = Math.min(Math.max(yearlyOTE - estimatedIncomeTaxBeforeSavings - employerMatch401k - iraContribution, 0), limit401k - employerMatch401k)
    console.log('taxBenefit401k', taxBenefit401k)

    if (!formData.withdrawWhileIncome) { // prioritize traditional accounts for pre-tax savings

        var updatedFederalIncomeTax = getFederalIncomeTax(yearlyOTE - employerMatch401k - taxBenefit401k)
        updatedFederalIncomeTax = updatedFederalIncomeTax == undefined ? 0 : updatedFederalIncomeTax
        console.log('here2', updatedFederalIncomeTax)
        const traditional401k = employerMatch401k + taxBenefit401k

        const estimatedExtraCash = yearlyOTE - (updatedFederalIncomeTax + formData.stateTax + formData.localTax) - expenseAndSavings - traditional401k - iraContribution

        return {
            traditional401k: traditional401k,
            roth401k: 0,
            traditionalIra: 0,
            rothIra: iraContribution,
            estimatedTaxSavings: formData.federalTax - updatedFederalIncomeTax,
            estimatedExtraCash: estimatedExtraCash
        }
    } else { // prioritize roth accounts for withdrawal tax savings
        const roth401k = employerMatch401k + taxBenefit401k
        const estimatedExtraCash = yearlyOTE - estimatedIncomeTaxBeforeSavings - expenseAndSavings - roth401k - iraContribution

        return {
            traditional401k: 0,
            roth401k: roth401k,
            traditionalIra: 0,
            rothIra: iraContribution,
            estimatedTaxSavings: 0,
            estimatedExtraCash: estimatedExtraCash
        }
    }
}

const getFederalIncomeTax = (taxableIncome: number) => {
    const boundaryValues: number[] = [11000, 44725, 95375, 182100, 231250, 578125, Infinity]
    const boundaryTaxRates: number[] = [0.1, 0.12, 0.22, 0.24, 0.32, 0.35, 0.37]
    const boundaryBaseAmounts: number[] = [0, 1100, 5146.88, 16289.66, 37103.42, 52831.1, 174237]

    console.log('here', taxableIncome)
    for (let i = 0; i < boundaryValues.length; i++) {
        if (taxableIncome <= boundaryValues[i]) {
            const incomeTaxableAtCurrentBoundary = i != 0 ? taxableIncome - boundaryValues[i-1] : taxableIncome
            console.log('here1', i, incomeTaxableAtCurrentBoundary, boundaryValues[i], boundaryTaxRates[i], boundaryBaseAmounts[i])
            return Math.max(incomeTaxableAtCurrentBoundary * boundaryTaxRates[i] + boundaryBaseAmounts[i], 0)
        }
    }

    return undefined
}
