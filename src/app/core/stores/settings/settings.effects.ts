import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';

import { of, Observable, merge } from 'rxjs';
import { map, withLatestFrom,
    switchMap, catchError, filter, mergeMap
} from 'rxjs/operators';

import * as _ from 'lodash';

import { ElectronStorageService } from '@core/services/electron/electron-storage.service';
import { ElectronSavePathService } from '@core/services/electron/electron-save-path.service';
import { ElectronDownloadService } from '@core/services/electron/electron-download.service';

import {
    SettingsActionEditSavePath,
    SettingsActionTypes,
    SettingsActionSetSavePath,
    SettingsActionSetSuccess,
    SettingsActionLoadSettingsState,
    SettingsActionSetSettingsState} from './settings.actions';

import { SettingsState, MediaType } from './settings.model';


@Injectable()
export class SettingsEffects {

    constructor(
    private store$: Store<any>,
    private actions$: Actions<Action>,
    private savePathSrv: ElectronSavePathService,
    private storageSrv: ElectronStorageService) {
    }

    @Effect({ dispatch: false })
    loadSettingsState$ = this.actions$.pipe(
        ofType<SettingsActionLoadSettingsState>(SettingsActionTypes.LOAD_SETTINGS_STATE),
        switchMap((action) => {
            return this.storageSrv.getItem('settings').pipe(
                map((settings: SettingsState) => {
                    settings = settings[0];

                    if (_.isEmpty(settings)) {
                        this.savePathSrv.getDefaultSavePath().subscribe(savePath => {
                            const defaultSettings = {
                                savePath: savePath[0],
                                concurrentDownload: 3,
                                mediaType: MediaType.AUDIO
                            } as SettingsState;
                            this.store$.dispatch(new SettingsActionSetSettingsState(defaultSettings));
                        });

                    } else {
                        this.store$.dispatch(new SettingsActionSetSettingsState(settings));
                    }

                    this.store$.dispatch(new SettingsActionSetSuccess());
                }),
                catchError((err) => {
                    this.store$.dispatch(new SettingsActionSetSuccess());
                    return of(err);
                })
            );
        })
    );

    @Effect({ dispatch: false })
    editSavePath$ = this.actions$.pipe(
        ofType<SettingsActionEditSavePath>(SettingsActionTypes.EDIT_SAVE_PATH),
        withLatestFrom(this.store$.select('SettingsState')),
        switchMap(([action, settingsState]) => {
            return this.savePathSrv.editSavePath(settingsState.savePath).pipe(
                map((savePath: string) => {
                    return this.store$.dispatch(new SettingsActionSetSavePath(savePath[0]));
                })
            );
        })
    );

    @Effect()
    electronStoreSettingsState$ = this.actions$.pipe(
        ofType(
            SettingsActionTypes.SET_SETTINGS_STATE,
            SettingsActionTypes.SET_MEDIA_TYPE,
            SettingsActionTypes.SET_SAVE_PATH,
            SettingsActionTypes.SET_CONCURRENT_DL,
            SettingsActionTypes.INCREMENT_CONCURRENT_DL,
            SettingsActionTypes.DECREMENT_CONCURRENT_DL
        ),
        withLatestFrom(this.store$.select('SettingsState')),
        map(([action, state]) => {
            this.storageSrv.setItem('settings', state).subscribe();
            return new SettingsActionSetSuccess();
        })
    );
}
