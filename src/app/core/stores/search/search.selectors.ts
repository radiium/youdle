import { createSelector } from '@ngrx/store';

import { SearchState } from './search.model';

export const selectSearchState = (state: any) => {
    return state.SettingsState;
};

export const selectInputValue = createSelector(
    selectSearchState,
    (state: SearchState) => state.inputValue);
