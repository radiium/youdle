import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppStateService } from 'core/services/app-state.service';
import { AppState } from 'shared/models/app-state';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

    appState: AppState;

    constructor(
    private AppStateSrv: AppStateService,
    private cdRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.AppStateSrv.appState$.subscribe((data) => {
            this.appState = data;
            this.cdRef.detectChanges();
        });
    }
}
