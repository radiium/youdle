import { Component, OnInit } from '@angular/core';
import { AppStateService } from 'core/services/app-state.service';
import { UtilsService } from 'core/services/utils.service';
import { AppState } from 'shared/models/app-state';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    appState: AppState;

    constructor(
    private appStateSrv: AppStateService,
    private utilsSrv: UtilsService
    ) { }

    ngOnInit() {
        this.appStateSrv.appState$.subscribe((data) => {
            this.appState = data;
        });
    }

    onInputChange(event) {
        this.appStateSrv.setInputValue(event);
        this.utilsSrv.parseInputValue(event);
    }

    clearInput() {
        this.appStateSrv.setInputValue('');
        this.appStateSrv.setNotFound(false);
    }

    openSettings() {
        this.appStateSrv.setSelectedTab(1);
    }

    closeSettings() {
        this.appStateSrv.setSelectedTab(0);
    }

}
