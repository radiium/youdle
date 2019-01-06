import { createSelector } from '@ngrx/store';

import { SettingsState } from './settings.model';

export const selectSettingsState = (state: any) => {
    return state.SettingsState;
};

export const selectSavePath = createSelector(
    selectSettingsState,
    (state: SettingsState) => state.savePath);

export const selectConcurrentDownload = createSelector(
    selectSettingsState,
    (state: SettingsState) => state.concurrentDownload);
