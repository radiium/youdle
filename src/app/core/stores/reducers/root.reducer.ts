

import { ActionReducerMap } from '@ngrx/store';

import { settingsReducer, SettingsState } from '@stores/settings';
import { searchReducer, SearchState  } from '@stores/search';
import { VideoListState, videoListReducer } from '@stores/video-list';
import { AppState, appStateReducer } from '@stores/app-state';

export interface RootState {
    AppState: AppState;
    SettingsState: SettingsState;
    SearchState: SearchState;
    VideoListState: VideoListState;
}

export let rootReducer: ActionReducerMap<RootState> = {
    AppState: appStateReducer,
    SettingsState: settingsReducer,
    SearchState: searchReducer,
    VideoListState: videoListReducer
};
