import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import useSWR from 'swr'
import { BASE_API_URL } from "../constants";
import { fetcher, simpleFetcher } from "../utils";
import { useAuth } from "./AuthProvider";

export const CategoriesContext = createContext();

export const useCategories = () => useContext(CategoriesContext);

const initialState = {
  loading: true,
  categoryLimits: {},
  categoriesByType: {},
  size: 0,
  error: null
}

const categoriesReducer = (state, { type, payload }) => {
  switch (type) {
    // eslint-disable-next-line no-lone-blocks
    case 'set-loading': {
      return {
        ...state,
        loading: true
      }
    };
    case 'set-categories': {
      const allCategories = { ...state.categoryLimits, ...payload };
      const categoriesByType = Object.keys(allCategories).reduce((acc, category) => {
        const categoryType = allCategories[category].type;
        return {
          ...acc,
          [categoryType]: (acc[categoryType] || []).concat(category),
          all: (acc.all || []).concat(category)
        }
      }, {});
      return {
        categoryLimits: allCategories,
        categoriesByType,
        loading: false,
        error: null
      };
    };
    // eslint-disable-next-line no-lone-blocks
    case 'set-error': {
      return {
        categoryLimits: null,
        categoriesByType: null,
        size: 0,
        error: payload
      }
    };
    case 'update-category': {
      // const groupingKey = Object.keys(state.grouping)[0];
      // const newGroupings = { ...state.grouping[groupingKey] };
      // const currentGroupingValue = state.items[payload.emailId][groupingKey];
      // const newGroupingValue = payload[groupingKey];
      // if (currentGroupingValue !== newGroupingValue) {
      //   const currentGroupingAsSet = new Set(newGroupings[currentGroupingValue]);
      //   currentGroupingAsSet.delete(payload.emailId);
      //   newGroupings[currentGroupingValue] = Array.from(currentGroupingAsSet);

      //   const newGroupingAsSet = new Set(newGroupings[newGroupingValue]);
      //   newGroupingAsSet.add(payload.emailId);
      //   newGroupings[newGroupingValue] = Array.from(newGroupingAsSet);
      // }

      // return {
      //   ...state,
      //   loading: false,
      //   items: {
      //     ...state.items,
      //     [payload.emailId]: payload
      //   },
      //   grouping: {
      //     [groupingKey]: newGroupings
      //   }
      // }
      return state;
    }
    default: {
      throw new Error(`Unkown action.type: ${type}`);
    }
  }
}


export const CategoriesProvider = ({ children }) => {
  const { sub } = useAuth();
  const url = sub ? `${BASE_API_URL}/categories` : "";
  const { data: categoryLimits, error, isLoading } = useSWR(url, simpleFetcher, { revalidateOnFocus: false, shouldRetryOnError: false });
  const [state, dispatch] = useReducer(categoriesReducer, initialState);

  // TODO: You're gonna have to make this into a reducer, similar to transactions.
  // Also, the API won't return the data in the response, so you will have to update
  // on client side based on request body.
  const actions = useMemo(() => ({
    setLoading: () => dispatch({ type: 'set-loading'}),
    setCategories: payload => dispatch({ type: 'set-categories', payload }),
    setError: payload => dispatch({ type: 'set-error', payload }),
    updateCategory: payload => dispatch({ type: 'update-category', payload }),
    batchEditCategories: async (categoriesChanges) => {
      const fetchOptions = {
        method: "PATCH",
        body: JSON.stringify(categoriesChanges)
      };
      try {
        // throw new Error("HOWDY! This is a muuuuch longer error message to see if it wraps.");
        const response = await fetcher(`${BASE_API_URL}/categories`, fetchOptions);
        if (response.ok) {
          // TODO: this will probably chang ein the future once we start tracking
          // historical changes. At that point, the API will need to perform a read on the DB to get the
          // history array and push a new value in. That means that the API will be able to return
          // the full edited resource.
          const updatedPayload = categoriesChanges.changes.reduce((acc, categoryChange) => ({
            ...acc,
            [categoryChange.category]: categoryChange
          }), {});
          dispatch({ type: 'set-categories', payload: updatedPayload })
        } else {
          const responseBody = await response.json();
          console.debug(responseBody);
          actions.setError(responseBody);
          throw new Error(responseBody);
        }
      } catch (err) {
        throw err;
        // TODO: Seems like setting the error here breaks the app, as
        // the data vanishes and breaks some components...
        // Also, we should probably rethrow and let downstream handle it? Or maybe not,
        // since components have access to the error state itself, and can liste to that
        // and react accordingly.
        // actions.setError(err);
      }
    }
  }), []);

  useEffect(() => {
    isLoading && actions.setLoading();

    error && actions.setError(error);

    categoryLimits && actions.setCategories(categoryLimits.items);
  }, [isLoading, categoryLimits, error, actions]);

  if (error) {
    console.error(error);
    return null;
  }

  return (
    <CategoriesContext.Provider value={[ state, actions ]}>
      {children}
    </CategoriesContext.Provider>
  )
}
