import { createSelector } from '@ngrx/store';

import { AppState } from './app-state.model';

export const selectAppState = (state: any) => {
    return state.AppState;
};

export const selectIsSearching = createSelector(
    selectAppState,
    (state: AppState) => state.isSearching);

export const selectIsDownloading = createSelector(
    selectAppState,
    (state: AppState) => state.isDownloading);
