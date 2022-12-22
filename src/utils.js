export const printMoney = amount => {
  if (typeof amount === "string" && amount[0] === "$") {
    return amount;
  }

  // Extracts the decimal bit by mod division, rounds it to 2 digits
  // and removes the "0."" initial part of the string.
  const decimal = (amount % 1).toFixed(2).slice(2,4);

  return `$${Math.floor(amount)}.${decimal}`;
}

export const printDate = timestamp => new Date(timestamp).toDateString()