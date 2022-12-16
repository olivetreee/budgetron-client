import { createContext, useContext } from "react";
import useSWR from 'swr'
import { BASE_API_URL } from "../constants";

export const CategoriesContext = createContext();

export const useCategories = () => useContext(CategoriesContext);

const fetcher = async (...params) => {
  const response = await fetch(...params);
  const parsedResponse = await response.json();
  return parsedResponse;
}

export const CategoriesProvider = ({ children }) => {
  // const [transactions, setTransactions] = useState(mockTransactionData);
  const url = `${BASE_API_URL}/categories`;
  const { data, error } = useSWR(url, fetcher);

  if (error) {
    console.error(error);
    return null;
  }

  return (
    <CategoriesContext.Provider value={[ data ]}>
      {children}
    </CategoriesContext.Provider>
  )
}
