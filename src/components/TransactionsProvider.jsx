import { createContext, useContext, useMemo, useEffect, useReducer } from "react";
import useSWR from 'swr'
import { BASE_API_URL } from "../constants";
import { fetcher, simpleFetcher } from "../utils";
import { useAuth } from "./AuthProvider";

export const TransactionsContext = createContext();

export const useTransactions = () => useContext(TransactionsContext);

const todaysMonthYear = `${new Date().getUTCMonth() + 1}/${new Date().getUTCFullYear()}`;
// const todaysMonthYear = "12/2022";

const getInitialState = (data, error, isLoading) => ({
  loading: isLoading,
  items: data?.items,
  size: data?.size,
  grouping: data?.grouping,
  error: error
});

const transactionsReducer = (state, { type, payload }) => {
  switch (type) {
    // eslint-disable-next-line no-lone-blocks
    case 'set-loading': {
      return {
        ...state,
        loading: true
      }
    };
    // eslint-disable-next-line no-lone-blocks
    case 'set-transactions': {
      return {
        ...payload,
        loading: false,
        error: null
      };
    };
    // eslint-disable-next-line no-lone-blocks
    case 'set-error': {
      return {
        items: null,
        size: 0,
        grouping: null,
        error: payload
      }
    };
    case 'update-transaction': {
      const groupingKey = Object.keys(state.grouping)[0];
      const newGroupings = { ...state.grouping[groupingKey] };
      const currentGroupingValue = state.items[payload.emailId][groupingKey];
      const newGroupingValue = payload[groupingKey];
      if (currentGroupingValue !== newGroupingValue) {
        const currentGroupingAsSet = new Set(newGroupings[currentGroupingValue]);
        currentGroupingAsSet.delete(payload.emailId);
        newGroupings[currentGroupingValue] = Array.from(currentGroupingAsSet);

        const newGroupingAsSet = new Set(newGroupings[newGroupingValue]);
        newGroupingAsSet.add(payload.emailId);
        newGroupings[newGroupingValue] = Array.from(newGroupingAsSet);
      }

      return {
        ...state,
        loading: false,
        items: {
          ...state.items,
          [payload.emailId]: payload
        },
        grouping: {
          [groupingKey]: newGroupings
        }
      }
    }
    default: {
      throw new Error(`Unkown action.type: ${type}`);
    }
  }
}

export const TransactionsProvider = ({
  date = todaysMonthYear,
  groupBy = "category",
  children
}) => {
  const { sub } = useAuth();
  const dateToQuery = date.replace("/", "-");
  const url = sub ? `${BASE_API_URL}/transactions?date=${dateToQuery}&groupBy=${groupBy}` : "";
  const { data, error, isLoading } = useSWR(url, simpleFetcher, { revalidateOnFocus: false, shouldRetryOnError: false });
  const [state, dispatch] = useReducer(transactionsReducer, getInitialState(data, error, isLoading));

  const actions = useMemo(() => ({
    setLoading: () => dispatch({ type: 'set-loading'}),
    setTransactions: payload => dispatch({ type: 'set-transactions', payload }),
    setError: payload => dispatch({ type: 'set-error', payload }),
    updateTransaction: payload => dispatch({ type: 'update-transaction', payload }),
    editTransaction: async (transactionData) => {
      const fetchOptions = {
        method: "PATCH",
        body: JSON.stringify(transactionData)
      }

      try {
        // throw new Error("HOWDY! This is a muuuuch longer error message to see if it wraps.");
        const response = await fetcher(`${BASE_API_URL}/transactions`, fetchOptions);
        const responseBody = await response.json();
        if (response.ok) {
          dispatch({ type: 'update-transaction', payload: responseBody })
        } else {
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
    !data && !error && actions.setLoading();

    error && actions.setError(error);

    data && actions.setTransactions(data);
  }, [data, error, actions]);

  if (error) {
    console.error(error);
    return null;
  }

  return (
    <TransactionsContext.Provider value={[ state, actions, error ]}>
      {children}
    </TransactionsContext.Provider>
  )
}
