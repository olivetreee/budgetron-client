import { createContext, useContext, useMemo } from "react";
import useSWR from 'swr'
import { BASE_API_URL } from "../constants";
import { simpleFetcher } from "../utils";
import { useAuth } from "./AuthProvider";

export const CategoriesContext = createContext();

export const useCategories = () => useContext(CategoriesContext);

export const CategoriesProvider = ({ children }) => {
  const { sub } = useAuth();
  const url = sub ? `${BASE_API_URL}/categories` : "";
  const { data: categoryLimits, error } = useSWR(url, simpleFetcher, { revalidateOnFocus: false, shouldRetryOnError: false });

  const categoriesList = useMemo(() => {
    if (error || !categoryLimits) {
      return {};
    };

    return Object.keys(categoryLimits.items).reduce((acc, category) => {
      const categoryType = categoryLimits.items[category].type;
      return {
        ...acc,
        [categoryType]: (acc[categoryType] || []).concat(category),
        all: (acc.all || []).concat(category)
      }
    }, {})
  },
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
