export const printMoney = (amount, showDecimal = true) => {
  if (typeof amount === "string" && amount[0] === "$") {
    return amount;
  }

  // Extracts the decimal bit by mod division, rounds it to 2 digits
  // and removes the "0."" initial part of the string.
  const decimal = showDecimal ? "." + (amount % 1).toFixed(2).slice(2,4) : "";

  return `$${Math.floor(amount).toLocaleString()}${decimal}`;
}

export const fetcher = async (url, options = {}, ...params) => {
  const gid = localStorage.getItem("profile");
  const headers = {
    ...options.headers,
    "x-amzcpt-current-user": gid
  }
  const optionsWithHeaders = {
    ...options,
    headers
  }
  return fetch(url, optionsWithHeaders, ...params);
}

export const simpleFetcher = async (...params) => {
  const response = await fetcher(...params);
  return response.json();
}

export const makeTransactionId = transaction => `${transaction.monthYear}+${transaction.emailId}`;