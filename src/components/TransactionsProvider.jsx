import { createContext, useContext, useState, useEffect } from "react";
import useSWR from 'swr'
import { BASE_API_URL } from "../constants";

export const TransactionsContext = createContext();

export const useTransactions = () => useContext(TransactionsContext);

const todaysMonthYear = `${new Date().getUTCMonth() + 1}/${new Date().getUTCFullYear()}`;

const fetcher = async (...params) => {
  const response = await fetch(...params);
  const parsedResponse = await response.json();
  return parsedResponse;
}

export const TransactionsProvider = ({
  date = todaysMonthYear,
  groupBy = "category",
  children
}) => {
  // const [transactions, setTransactions] = useState(mockTransactionData);
  const dateToQuery = date.replace("/", "-");
  const url = `${BASE_API_URL}/transactions?date=${dateToQuery}&groupBy=${groupBy}`;
  const { data, error } = useSWR(url, fetcher);
  const [loading, setLoading] = useState(!data && !error);

  useEffect(() => {
    setLoading(!data && !error)
  }, [data, error]);

  if (error) {
    console.error(error);
    return null;
  }

  return (
    <TransactionsContext.Provider value={[ data, loading, error ]}>
      {children}
    </TransactionsContext.Provider>
  )
}
