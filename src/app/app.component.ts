import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DataService } from 'core/services/data.service';
import { UtilsService } from 'core/services/utils.service';
import { AppState } from 'shared/models/app-state';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    appState: AppState;

    constructor(
    private utilsSrv: UtilsService,
    private dataSrv: DataService,
    private cdRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.dataSrv.appState$.subscribe((data) => {
            this.appState = data;
            this.cdRef.detectChanges();
        });
        this.utilsSrv.loadOsType();
    }
}
