export const formatCurrency = (amount) => {
  // Convert to integer if it's a decimal
  const integerAmount = Math.round(amount);
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(integerAmount);
};
