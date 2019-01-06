import { createSelector } from '@ngrx/store';
import { VideoListState } from './video-list.model';

export const selectVideoListState = (state: any) => {
    return state.VideoListState;
};

export const selectItems = createSelector(
    selectVideoListState,
    (state: VideoListState) => state.items);

export const selectSelectedItems = createSelector(
    selectVideoListState,
    (state: VideoListState) => state.selectedItems);
