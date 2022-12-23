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

const getInitialState = (data, error) => ({
  loading: !data &&!error,
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
    case 'update-transactions': {
      const groupingKey = Object.keys(state.grouping)[0];
      const newGroupings = { ...state.grouping[groupingKey] };
      payload.items.forEach(transaction => {
        const currentGroupingValue = state.items[transaction.emailId][groupingKey];
        const newGroupingValue = payload.items[transaction.emailId][groupingKey];
        if (currentGroupingValue !== newGroupingValue) {
          const currentGroupingAsSet = new Set(newGroupings[currentGroupingValue]);
          currentGroupingAsSet.delete(transaction.emailId);
          newGroupings[currentGroupingValue] = Array.from(currentGroupingAsSet);

          const newGroupingAsSet = new Set(newGroupings[newGroupingValue]);
          newGroupingAsSet.add(transaction.emailId);
          newGroupings[currentGroupingValue] = Array.from(newGroupingAsSet);
        }
      })

      return {
        ...state,
        loading: false,
        items: {
          ...state.items,
          ...payload.items
        },
        grouping: newGroupings
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
  const { data, error } = useSWR(url, fetcher);
  const [state, dispatch] = useReducer(transactionsReducer, getInitialState(data, error));

  const actions = useMemo(() => ({
    setLoading: () => dispatch({ type: 'set-loading'}),
    setTransactions: payload => dispatch({ type: 'set-transactions', payload }),
    setError: payload => dispatch({ type: 'set-error', payload }),
    updateTransactions: payload => dispatch({ type: 'update-transactions', payload }),
  }), []);

  useEffect(() => {
    console.log('@@@inside useEffect');
    !data && !error && actions.setLoading();

    error && actions.setError(error);

    data && actions.setTransactions(data);
  }, [data, error, actions]);

  if (error) {
    console.error(error);
    return null;
  }

  // const editTransactions = async (transactions) => {
  //   const fetchOptions = {
  //     method: "PATCH",
  //     body: JSON.stringify(transactions)
  //   }

  //   try {
  //     const response = await fetcher(`${BASE_API_URL}/transactions`, fetchOptions);
  //     if (response.status === 200) {
  //       setFetchStatus("success");
  //     } else {
  //       const responseBody = await response.json();
  //       console.debug(responseBody);
  //       throw new Error(`Non-200 status: ${response.status}`);

  //     }
  //   } catch (err) {
  //     setFetchStatus("error");
  //   }
  // }

  return (
    <TransactionsContext.Provider value={[ state, error ]}>
      {children}
    </TransactionsContext.Provider>
  )
}
