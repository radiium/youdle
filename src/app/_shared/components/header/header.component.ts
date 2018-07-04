import { Component, OnInit } from '@angular/core';
import { DataService } from 'core/services/data.service';
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
    private dataSrv: DataService,
    private utilsSrv: UtilsService
    ) { }

    ngOnInit() {
        this.dataSrv.appState$.subscribe((data) => {
            this.appState = data;
        });
    }

    onInputChange(event) {
        this.dataSrv.setInputValue(event);
        this.utilsSrv.parseInputValue(event);
    }

    clearInput() {
        this.dataSrv.setInputValue('');
        this.dataSrv.setNotFound(false);
    }

    openSettings() {
        this.dataSrv.setSelectedTab(1);
    }

    closeSettings() {
        this.dataSrv.setSelectedTab(0);
    }

}
