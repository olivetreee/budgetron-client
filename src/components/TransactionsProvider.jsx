import { createContext, useContext, useState } from "react";
import { mockTransactionData } from "../constants/mockData";

export const TransactionsContext = createContext();

export const useTransactions = () => useContext(TransactionsContext);


export const TransactionsProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(mockTransactionData);
  return (
    <TransactionsContext.Provider value={[ transactions, setTransactions ]}>
      {children}
    </TransactionsContext.Provider>
  )
}
