import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataService } from 'core/services/data.service';
import { Settings, Message } from 'shared/models';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

    settings: Settings;
    message: Message;

    constructor(
    private dataSrv: DataService) {
    }

    ngOnInit() {
        this.dataSrv.settings$.subscribe((data) => {
            this.settings = data;
        });

        this.dataSrv.message$.subscribe((data) => {
            this.message = data;
        });
    }

    onReturn() {
        this.dataSrv.setSelectedTab(0);
    }
}
