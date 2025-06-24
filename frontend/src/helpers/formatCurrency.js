export const formatCurrency = (amount) => {
  // Convert to integer if it's a decimal
  const integerAmount = Math.round(amount);
  return `Rs ${integerAmount.toLocaleString('en-IN')}`;
};
