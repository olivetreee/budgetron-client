import { createContext, useContext, useMemo, useEffect, useReducer } from "react";
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
        newGroupings[newGroupingAsSet] = Array.from(newGroupingAsSet);
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
  const dateToQuery = date.replace("/", "-");
  const url = `${BASE_API_URL}/transactions?date=${dateToQuery}&groupBy=${groupBy}`;
  const { data, error, isLoading } = useSWR(url, fetcher, { revalidateOnFocus: false, shouldRetryOnError: false });
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
        const response = await fetch(`${BASE_API_URL}/transactions`, fetchOptions);
        const responseBody = await response.json();
        if (response.ok) {
          dispatch({ type: 'update-transaction', payload: responseBody })
        } else {
          console.debug(responseBody);
          actions.setError(responseBody);
        }
      } catch (err) {
        actions.setError(err);
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
