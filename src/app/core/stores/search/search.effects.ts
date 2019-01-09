import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of, Observable } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import * as _ from 'lodash';

import { ResourceType } from './search.model';
import {
    VideoListActionSetItems,
    VideoListActionEmptyState } from '../video-list';
import {
    SearchActionTypes,
    SearchActionSetInputValue,
    SearchActionClearInputValue,
    SearchActionSetResource,
    SearchActionFetchResource,
    SearchActionFetchResourceSuccess,
    SearchActionFetchResourceError } from './search.actions';

import { UtilsService } from '@core/services/utils.service';
import { YoutubeService } from '@core/services/youtube.service';
import { NotificationService } from '@core/services/notification.service';
import { AppStateActionShowIsSearching, AppStateActionHideIsSearching } from '../app-state';

@Injectable()
export class SearchEffects {

    constructor(
    private utilsSrv: UtilsService,
    private ytSrv: YoutubeService,
    private notificationsSrv: NotificationService,
    private actions$: Actions<Action>,
    private store$: Store<any>) {
    }

    @Effect({ dispatch: false })
    setInputValue$ = this.actions$.pipe(
        ofType<SearchActionSetInputValue>(SearchActionTypes.SET_INPUT_VALUE),
        map(action => {
            const resource = this.utilsSrv.extractResource(action.payload);
            this.store$.dispatch(new SearchActionSetResource(resource));
            this.store$.dispatch(new AppStateActionShowIsSearching());
        })
    );

    @Effect()
    clearInputValue$ = this.actions$.pipe(
        ofType<SearchActionClearInputValue>(SearchActionTypes.CLEAR_INPUT_VALUE),
        map(() => new SearchActionSetInputValue(''))
    );

    @Effect({ dispatch: false })
    setResource$ = this.actions$.pipe(
        ofType<SearchActionSetResource>(SearchActionTypes.SET_RESOURCE),
        map(action => this.store$.dispatch(new SearchActionFetchResource(action.payload)))
    );

    @Effect({ dispatch: false })
    fetchResourceVideo$ = this.actions$.pipe(
        ofType<SearchActionFetchResource>(SearchActionTypes.FETCH_RESOURCE),
        switchMap(action => {
            let req: Observable<any>;

            // Video resource
            if (action.payload.type === ResourceType.VIDEO) {
                req = this.ytSrv.getVideosById(action.payload.id);

            // Playlist resource
            } else if (action.payload.type === ResourceType.PLAYLIST) {
                req = this.ytSrv.fetchYoutubePlaylists(action.payload.id);

            // Empty resource
            } else if (action.payload.type === ResourceType.EMPTY) {
                req = of(this.store$.dispatch(new SearchActionFetchResourceSuccess()));
            }

            return req.pipe(
                map((data) => {
                    const items = this.utilsSrv.parseVideoList(data['items'] || data);
                    this.notificationsSrv.info(`${items.length} item${items.length > 1 ? 's' : ''} found!`);
                    this.store$.dispatch(new VideoListActionSetItems(items));
                    this.store$.dispatch(new SearchActionFetchResourceSuccess());
                }),
                catchError((err) => {
                    this.store$.dispatch(new SearchActionFetchResourceError());
                    return of(err);
                })
            );
        })
    );

    @Effect()
    fetchResourceError$ = this.actions$.pipe(
        ofType<SearchActionFetchResourceError>(SearchActionTypes.FETCH_RESOURCE_ERROR),
        map((action) => {
            this.store$.dispatch(new VideoListActionEmptyState());
            return new AppStateActionHideIsSearching();
        })
    );

    @Effect()
    fetchResourceSuccess$ = this.actions$.pipe(
        ofType<SearchActionFetchResourceSuccess>(SearchActionTypes.FETCH_RESOURCE_SUCCESS),
        map((action) => new AppStateActionHideIsSearching()),
    );
}
