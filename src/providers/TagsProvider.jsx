import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import useSWR from 'swr'
import { BASE_API_URL } from "../constants";
import { simpleFetcher } from "../utils";
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
        loading: false,
        tags: null,
        size: 0,
        error: payload
      }
    };
    case 'update-tag': {
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


export const TagsProvider = ({ children }) => {
  const { sub } = useAuth();
  const url = sub ? `${BASE_API_URL}/tags` : "";
  const { data: tags, error, isLoading } = useSWR(url, simpleFetcher, { revalidateOnFocus: false, shouldRetryOnError: false });
  const [state, dispatch] = useReducer(tagsReducer, initialState);

  const actions = useMemo(() => ({
    setLoading: () => dispatch({ type: 'set-loading'}),
    setTags: payload => dispatch({ type: 'set-tags', payload }),
    setError: payload => dispatch({ type: 'set-error', payload })
  }), []);

  const apiActions = {
    createTag: async (tagToCreate) => {
      console.log('@@@tagToCreate', tagToCreate);
      return {
        id: tagToCreate.toLowerCase().replace(/\s/g, "-")
      }
    },
    editTag: async (tag) => {
      console.log('@@@tag', tag);
    },
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
