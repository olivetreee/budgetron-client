import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import useSWR from 'swr'
import { BASE_API_URL } from "../constants";
import { fetcher, makeTransactionId, simpleFetcher } from "../utils";
import { useAuth } from "../components/AuthProvider";

export const TagsContext = createContext();

export const useTags = () => useContext(TagsContext);

const initialState = {
  loading: true,
  tags: new Map(),
  size: 0,
  error: null
}

const tagsReducer = (state, { type, payload }) => {
  switch (type) {
    // eslint-disable-next-line no-lone-blocks
    case 'set-loading': {
      return {
        ...state,
        loading: true
      }
    };
    // eslint-disable-next-line no-lone-blocks
    case 'set-tags': {
      return {
        loading: false,
        tags: new Map(Object.entries(payload)),
        size: Object.keys(payload).length,
        error: null
      }
    };
    // eslint-disable-next-line no-lone-blocks
    case 'set-error': {
      return {
        ...state,
        loading: false,
        error: payload
      }
    };
    case 'add-tag': {
      return {
        ...state,
        tags: state.tags.set(payload.id, payload),
        size: state.size + 1
      }
    }
    case 'update-tag': {
      return {
        ...state,
        tags: state.tags.set(payload.id, payload)
      }
    }
    default: {
      throw new Error(`Unkown action.type: ${type}`);
    }
  }
}


export const TagsProvider = ({ children }) => {
  const { sub } = useAuth();
  const url = sub ? `${BASE_API_URL}/tags` : "";
  const { data: tags, error, isLoading, mutate } = useSWR(url, simpleFetcher, { revalidateOnFocus: false, shouldRetryOnError: false });
  const [state, dispatch] = useReducer(tagsReducer, initialState);

  const actions = useMemo(() => ({
    setLoading: () => dispatch({ type: 'set-loading'}),
    setTags: payload => dispatch({ type: 'set-tags', payload }),
    setError: payload => dispatch({ type: 'set-error', payload })
  }), []);

  const apiActions = {
    mutate,
    createTag: async (tagToCreate, transaction) => {
      const transactionId = makeTransactionId(transaction);
      const fetchOptions = {
        method: "POST",
        body: JSON.stringify({ name: tagToCreate, transactionId })
      };
      try {
        const response = await fetcher(`${BASE_API_URL}/tags`, fetchOptions);
        const responseBody = await response.json();
        if (response.ok) {
          dispatch({ type: 'add-tag', payload: responseBody });
          return responseBody;
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
    // removeTransactionFromTag: async (tag, transaction) => {
    //   const transactionId = makeTransactionId(transaction);
    //   const currentTagTransactions = new Set(tag.transactions);
    //   currentTagTransactions.delete(transactionId);
    //   const tagUpdatedTransactions = Array.from(currentTagTransactions);
    //   const body = {
    //     id: tag.id,
    //     changes: [
    //       { path: "transactions", newValue: tagUpdatedTransactions }
    //     ]
    //   }
    //   console.log('@@@body', body);
    //   const fetchOptions = {
    //     method: "PATCH",
    //     body: JSON.stringify(body)
    //   };
    //   try {
    //     const response = await fetcher(`${BASE_API_URL}/tags`, fetchOptions);
    //     const responseBody = await response.json();
    //     if (response.ok) {
    //       const updatedTag = {
    //         ...tag,
    //         transactions: tagUpdatedTransactions
    //       }
    //       dispatch({ type: 'update-tag', payload: updatedTag });
    //       return responseBody;
    //     } else {
    //       console.debug(responseBody);
    //       actions.setError(responseBody);
    //       throw new Error(responseBody);
    //     }
    //   } catch (err) {
    //     throw err;
    //     // TODO: Seems like setting the error here breaks the app, as
    //     // the data vanishes and breaks some components...
    //     // Also, we should probably rethrow and let downstream handle it? Or maybe not,
    //     // since components have access to the error state itself, and can liste to that
    //     // and react accordingly.
    //     // actions.setError(err);
    //   }
    // },
  }

  useEffect(() => {
    isLoading && actions.setLoading();

    error && actions.setError(error);

    tags && actions.setTags(tags.items);
  }, [isLoading, tags, error, actions]);

  if (error) {
    console.error(error);
    return null;
  }

  return (
    <TagsContext.Provider value={[ state, { ...actions, ...apiActions } ]}>
      {children}
    </TagsContext.Provider>
  )
}
