import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
import { of, EMPTY } from 'rxjs';
import { map, switchMap, mergeMap, withLatestFrom, take, filter } from 'rxjs/operators';
import * as _ from 'lodash';

import {
    VideoListState,
    VideoListItem
} from './video-list.model';

import {
    VideoListActionTypes,
    VideoListActionSetState,
    VideoListActionSetItems,
    VideoListActionSetSelectedItems,
    VideoListActionStartDownload,
    VideoListActionStartDownloadSuccess,
    VideoListActionUpdateItems,
    VideoListActionUpdateItemsSuccess,
    VideoListActionCancelDownload,
    VideoListActionCancelDownloadSuccess,
    VideoListActionEmptyState,

} from './video-list.actions';
import { ApiService } from '@core/services/api.service';
import { DownloadService } from '@core/services/download.service';
import { SearchActionClearInputValue } from '../search';

@Injectable()
export class VideoListEffects {

    constructor(
    private downloadSrv: DownloadService,
    private actions$: Actions<Action>,
    private store$: Store<any>) {
    }


    @Effect({ dispatch: false })
    startDownload$ = this.actions$.pipe(
        ofType<VideoListActionStartDownload>(VideoListActionTypes.START_DOWNLOAD),
        withLatestFrom(
            this.store$.select('VideoListState'),
            this.store$.select('SettingsState')
        ),
        mergeMap(data => {
            const selectedItems = data[1].selectedItems;
            const settings = data[2];
            this.downloadSrv.startDownloadVideo(selectedItems, settings);

            this.store$.dispatch(new VideoListActionStartDownloadSuccess());
            return EMPTY;
        })
    );

    @Effect({ dispatch: false })
    cancelDownload$ = this.actions$.pipe(
        ofType<VideoListActionCancelDownload>(VideoListActionTypes.CANCEL_DOWNLOAD),
        mergeMap(action => {
            this.downloadSrv.cancelDownload();
            this.store$.dispatch(new VideoListActionCancelDownloadSuccess());
            return EMPTY;
        })
    );


    @Effect({ dispatch: false })
    updateItems$ = this.actions$.pipe(
        ofType<VideoListActionUpdateItems>(VideoListActionTypes.UPDATE_ITEMS),
        withLatestFrom(this.store$.select('VideoListState')),
        map(data => {
            const items = _.cloneDeep(data[1].items);
            const selectedItems = _.cloneDeep(data[1].items);
            const toUpdateItems = data[0].payload;

            const updated = this.replaceItems(items, toUpdateItems);
            const updatedSel = this.replaceItems(selectedItems, toUpdateItems);

            this.store$.dispatch(new VideoListActionSetItems(updated));
            this.store$.dispatch(new VideoListActionSetSelectedItems(updatedSel));

            return this.store$.dispatch(new VideoListActionUpdateItemsSuccess());
            // return new VideoListActionUpdateItemsSuccess();
        })
    );

    replaceItems(oriList, list2) {
        return oriList.map(video => {
            const upVid = _.find(list2, { id: video.id });
            if (upVid) {
                return upVid;
            }
            return video;
        });
    }
}
