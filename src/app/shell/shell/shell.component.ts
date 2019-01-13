import { Component, OnInit, isDevMode } from '@angular/core';
import * as _ from 'lodash';

import { AppState } from '@core/stores/app-state';
import { SearchState } from '@core/stores/search';
import { ApiService } from '@core/services/api.service';
import { DialogService } from '@core/services/dialog.service';

@Component({
    selector: 'app-shell',
    templateUrl: './shell.component.html',
    styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {

    appState: AppState;
    searchState: SearchState;

    constructor(
    private apiSrv: ApiService,
    private dialogSrv: DialogService) {

        this.apiSrv.loadSettingsState();

        if (isDevMode()) {
            // Long playlist
            // this.apiSrv.setInputValue('https://www.youtube.com/watch?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj');

            // Short playlist
            this.apiSrv.setInputValue('https://www.youtube.com/playlist?list=PLWKjhJtqVAbnZtkAI3BqcYxKnfWn_C704');

            // Single video
            // this.setInputValue('https://www.youtube.com/watch?v=FWhTvtbqIco');
        }
    }

    ngOnInit() {
        this.apiSrv.getAppState().subscribe((data) => this.appState = data);
        this.apiSrv.getSearchState().subscribe((data) => this.searchState = data);
    }

    onInputChange(event) {
        this.apiSrv.setInputValue(event);
    }

    clearInput() {
        this.apiSrv.clearInputValue();
    }

    openSettingsDialog() {
        this.dialogSrv.openSettingsDialog();
    }
}
