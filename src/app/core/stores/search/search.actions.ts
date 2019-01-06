import { Action } from '@ngrx/store';
import { SearchState, Resource } from './search.model';

export enum SearchActionTypes {
    SET_SEARCH_STATE = '[SEARCH] SET_SEARCH_STATE',
    SET_INPUT_VALUE = '[SEARCH] SET_INPUT_VALUE',
    CLEAR_INPUT_VALUE = '[SEARCH] CLEAR_INPUT_VALUE',
    SET_RESOURCE = '[SEARCH] SET_RESOURCE',
    FETCH_RESOURCE = '[SEARCH] FETCH_RESOURCE',
    FETCH_RESOURCE_ERROR = '[SEARCH] FETCH_RESOURCE_ERROR',
    FETCH_RESOURCE_SUCCESS = '[SEARCH] FETCH_RESOURCE_SUCCESS',
}

// Set search state
export class SearchActionSetSearchState implements Action {
    readonly type = SearchActionTypes.SET_SEARCH_STATE;
    constructor(public payload: SearchState) {}
}

// Set input value
export class SearchActionSetInputValue implements Action {
    readonly type = SearchActionTypes.SET_INPUT_VALUE;
    constructor(public payload: string) {}
}

// Clear input value
export class SearchActionClearInputValue implements Action {
    readonly type = SearchActionTypes.CLEAR_INPUT_VALUE;
    constructor() {}
}

// Set resource
export class SearchActionSetResource implements Action {
    readonly type = SearchActionTypes.SET_RESOURCE;
    constructor(public payload: Resource) {}
}

// Fetch resource playlist or video data
export class SearchActionFetchResource implements Action {
    readonly type = SearchActionTypes.FETCH_RESOURCE;
    constructor(public payload: Resource) {}
}

// Fetch resource error
export class SearchActionFetchResourceError implements Action {
    readonly type = SearchActionTypes.FETCH_RESOURCE_ERROR;
    constructor() {}
}

// Fetch resource success
export class SearchActionFetchResourceSuccess implements Action {
    readonly type = SearchActionTypes.FETCH_RESOURCE_SUCCESS;
    constructor() {}
}

export type SearchActions =
    | SearchActionSetSearchState
    | SearchActionSetInputValue
    | SearchActionClearInputValue
    | SearchActionSetResource
    | SearchActionFetchResource
    | SearchActionFetchResourceError
    | SearchActionFetchResourceSuccess;
