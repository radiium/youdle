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

export class SearchActionSetSearchState implements Action {
    readonly type = SearchActionTypes.SET_SEARCH_STATE;
    constructor(public payload: SearchState) {}
}

export class SearchActionSetInputValue implements Action {
    readonly type = SearchActionTypes.SET_INPUT_VALUE;
    constructor(public payload: string) {}
}

export class SearchActionClearInputValue implements Action {
    readonly type = SearchActionTypes.CLEAR_INPUT_VALUE;
    constructor() {}
}

export class SearchActionSetResource implements Action {
    readonly type = SearchActionTypes.SET_RESOURCE;
    constructor(public payload: Resource) {}
}

export class SearchActionFetchResource implements Action {
    readonly type = SearchActionTypes.FETCH_RESOURCE;
    constructor(public payload: Resource) {}
}

export class SearchActionFetchResourceError implements Action {
    readonly type = SearchActionTypes.FETCH_RESOURCE_ERROR;
    constructor() {}
}

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
