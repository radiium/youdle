import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DataService } from 'core/services/data.service';
import { Settings, Message, MessageType } from 'shared/models';
import { Title } from '../../../node_modules/@angular/platform-browser';

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
        const message: Message = {
            type: MessageType.NONE,
            title: '',
            description: ''
        };
        this.dataSrv.setSelectedTab(0);
        this.dataSrv.setMessage(message);
    }
}
