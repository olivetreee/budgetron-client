import { createContext, useContext, useMemo, useEffect, useReducer } from "react";
import useSWR from 'swr'
import { BASE_API_URL } from "../constants";
import { fetcher, simpleFetcher } from "../utils";
import { useAuth } from "../components/AuthProvider";
import { usePeriod } from "../providers/PeriodProvider";
import { useTags } from "./TagsProvider";

export const TransactionsContext = createContext();

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
    case 'add-transaction': {
      const groupingKey = Object.keys(state.grouping)[0];
      const payloadGroupingProperty = payload[groupingKey];
      const currentGroupingList = state.grouping[groupingKey][payloadGroupingProperty] || [];
      const newGroupingList = currentGroupingList.concat(payload.emailId);
      return {
        ...state,
        size: Object.keys(state.items).length + 1,
        loading: false,
        error: null,
        items: {
          ...state.items,
          [payload.emailId]: payload
        },
        grouping: {
          [groupingKey]: {
            ...state.grouping[groupingKey],
            [payloadGroupingProperty]: newGroupingList,
          }
        }
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
        error: null,
        items: {
          ...state.items,
          [payload.emailId]: payload
        },
        grouping: {
          [groupingKey]: newGroupings
        }
      }
    };
    case "delete-transaction": {
      const { emailId } = payload;
      const { items, grouping } = state;
      const newItems = { ...items };
      delete newItems[emailId];

      const groupingKey = Object.keys(grouping)[0];
      const currentGroupingState = grouping[groupingKey];
      const currentItemGrouping = payload[groupingKey];
      const newGroupingSet = new Set(currentGroupingState[currentItemGrouping]);
      newGroupingSet.delete(emailId);
      const newGrouping = {
        ...currentGroupingState,
        [currentItemGrouping]: Array.from(newGroupingSet)
      }

      return {
        ...state,
        items: newItems,
        grouping: {
          [groupingKey]: newGrouping
        }
      };
    }
    default: {
      throw new Error(`Unkown action.type: ${type}`);
    }
  }
}

export const TransactionsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(transactionsReducer, getInitialState());

  const actions = useMemo(() => {
    return {
      setLoading: () => dispatch({ type: 'set-loading'}),
      setTransactions: payload => dispatch({ type: 'set-transactions', payload }),
      setError: payload => dispatch({ type: 'set-error', payload }),
      updateTransaction: payload => dispatch({ type: 'update-transaction', payload }),
    }
  }, [dispatch]);

  const apiActions = {
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
    },
    createTransaction: async (transactionData) => {
      // in case the ID is already a split one, we'll need to increment that index
      const [idBase, idSuffix = 0] = transactionData.emailId.split("-");
      let newIdSuffix = idSuffix + 1;
      let newEmailId = `${idBase}-${newIdSuffix}`;
      // Need to make sure this ID doesn't already exist.
      // It's unlikely that it'd exist in another month, so we can check against local state.
      while (state.items[newEmailId]) {
        newIdSuffix++;
        newEmailId = `${idBase}-${newIdSuffix}`;
      }
      const body = {
        ...transactionData,
        emailId: newEmailId
      }
      const fetchOptions = {
        method: "POST",
        body: JSON.stringify(body)
      };
      try {
        // throw new Error("HOWDY! This is a muuuuch longer error message to see if it wraps.");
        const response = await fetcher(`${BASE_API_URL}/transactions`, fetchOptions);
        if (response.ok) {
          dispatch({ type: 'add-transaction', payload: body })
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
    },
    deleteTransaction: async (transactionData) => {
      const { monthYear, emailId } = transactionData;
      const fetchOptions = {
        method: "DELETE",
      }

      const transactionId = encodeURIComponent(`${monthYear}+${emailId}`);

      try {
        // throw new Error("HOWDY! This is a muuuuch longer error message to see if it wraps.");
        const response = await fetcher(`${BASE_API_URL}/transactions/${transactionId}`, fetchOptions);
        if (response.ok) {
          dispatch({ type: 'delete-transaction', payload: transactionData });
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
  }

  return (
    <TransactionsContext.Provider value={[ state, actions, apiActions ]}>
      {children}
    </TransactionsContext.Provider>
  )
}

export const useTransactions = ({ groupBy = "category" }) => {
  const [state, actions, apiActions] = useContext(TransactionsContext);
  const [date] = usePeriod();
  const { sub } = useAuth();
  const dateToQuery = date.replace("/", "-");

  const url = sub ? `${BASE_API_URL}/transactions?date=${dateToQuery}&groupBy=${groupBy}` : "";
  const { data, error, isLoading } = useSWR(
    url,
    simpleFetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      dedupingInterval: 60 *  60 * 1000
    }
  );

  useEffect(() => {
    isLoading && actions.setLoading();

    error && actions.setError(error);

    data && actions.setTransactions(data);
  }, [isLoading, data, error, actions]);

  // if (error) {
  //   console.error(error);
  //   return null;
  // }

  return {
    state,
    actions: {
      ...actions,
      ...apiActions
    }
  }
};
