import { SearchState, ResourceType } from './search.model';
import { SearchActions, SearchActionTypes } from './search.actions';

export const initialState: SearchState = {
    inputValue: '',
    resource: {
        type: ResourceType.EMPTY,
        id: ''
    }
};

export function searchReducer(
    state: SearchState = initialState,
    action: SearchActions): SearchState {

    switch (action.type) {
        case SearchActionTypes.SET_SEARCH_STATE:
            return { ...state, ...action.payload };

        case SearchActionTypes.SET_INPUT_VALUE:
            return { ...state, inputValue: action.payload };

        case SearchActionTypes.CLEAR_INPUT_VALUE:
            return state;

        case SearchActionTypes.SET_RESOURCE:
            return { ...state, resource: action.payload };

        case SearchActionTypes.FETCH_RESOURCE:
        case SearchActionTypes.FETCH_RESOURCE_ERROR:
        case SearchActionTypes.FETCH_RESOURCE_SUCCESS:
            return state;

        default:
            return state;
    }
}
