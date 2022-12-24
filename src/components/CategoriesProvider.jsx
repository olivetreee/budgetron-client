import { createContext, useContext, useMemo } from "react";
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
  const url = `${BASE_API_URL}/categories`;
  const { data: categoryLimits, error } = useSWR(url, fetcher, { revalidateOnFocus: false, shouldRetryOnError: false });

  const categoriesList = useMemo(() => error || !categoryLimits
    ? []
    : Object.keys(categoryLimits.items),
  [error, categoryLimits]);

  if (error) {
    console.error(error);
    return null;
  }

  return (
    <CategoriesContext.Provider value={[ categoryLimits, categoriesList ]}>
      {children}
    </CategoriesContext.Provider>
  )
}
