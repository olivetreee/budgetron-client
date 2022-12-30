export const printMoney = amount => {
  if (typeof amount === "string" && amount[0] === "$") {
    return amount;
  }

  // Extracts the decimal bit by mod division, rounds it to 2 digits
  // and removes the "0."" initial part of the string.
  const decimal = (amount % 1).toFixed(2).slice(2,4);

  return `$${Math.floor(amount)}.${decimal}`;
}

// It doesn't print the year, since it's not needed, at least for now...
export const printDate = timestamp => new Date(timestamp).toDateString().replace(/[0-9]{4}$/, "");

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