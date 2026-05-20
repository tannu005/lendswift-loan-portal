import { PROCESSING_FEE_PERCENT, MIN_PROCESSING_FEE, MAX_PROCESSING_FEE, LOAN_CONFIGS } from './constants';

/**
 * Calculate EMI using reducing balance formula
 * EMI = P × r × (1+r)^n / ((1+r)^n – 1)
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (percentage)
 * @param {number} tenureMonths - Loan tenure in months
 * @returns {object} EMI details
 */
export function calculateEMI(principal, annualRate, tenureMonths) {
  if (!principal || !annualRate || !tenureMonths) {
    return { emi: 0, totalPayment: 0, totalInterest: 0, processingFee: 0 };
  }

  const P = Number(principal);
  const r = Number(annualRate) / 12 / 100; // Monthly interest rate
  const n = Number(tenureMonths);

  if (r === 0) {
    const emi = P / n;
    return {
      emi: Math.round(emi),
      totalPayment: Math.round(P),
      totalInterest: 0,
      processingFee: calculateProcessingFee(P),
    };
  }

  const rateCompound = Math.pow(1 + r, n);
  const emi = (P * r * rateCompound) / (rateCompound - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - P;
  const processingFee = calculateProcessingFee(P);

  return {
    emi: Math.round(emi),
    totalPayment: Math.round(totalPayment),
    totalInterest: Math.round(totalInterest),
    processingFee,
  };
}

/**
 * Calculate processing fee
 * 1% of loan amount, min ₹2,000, max ₹25,000
 */
export function calculateProcessingFee(amount) {
  const fee = (amount * PROCESSING_FEE_PERCENT) / 100;
  return Math.min(Math.max(Math.round(fee), MIN_PROCESSING_FEE), MAX_PROCESSING_FEE);
}

/**
 * Get interest rate for loan type
 */
export function getInterestRate(loanType) {
  return LOAN_CONFIGS[loanType]?.interestRate || 10.5;
}

/**
 * Check EMI affordability
 * EMI must not exceed 50% of monthly income
 */
export function checkEMIAffordability(emi, monthlyIncome, coApplicantIncome = 0) {
  const totalIncome = Number(monthlyIncome || 0) + Number(coApplicantIncome || 0);
  if (totalIncome === 0) return { affordable: false, ratio: 100, message: 'Income information required' };
  
  const ratio = (emi / totalIncome) * 100;
  const affordable = ratio <= 50;
  
  return {
    affordable,
    ratio: Math.round(ratio * 10) / 10,
    message: affordable
      ? `EMI is ${ratio.toFixed(1)}% of your income (within 50% limit)`
      : `EMI is ${ratio.toFixed(1)}% of your income (exceeds 50% limit). Consider a smaller amount or longer tenure.`,
  };
}
