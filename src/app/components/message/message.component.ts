import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'core/services/data.service';
import { Message, MessageType } from 'core/services/data.models';

@Component({
    selector: 'app-message',
    templateUrl: './message.component.html',
    styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

    message: Message;

    constructor(
    private router: Router,
    private dataSrv: DataService) {
    }

    ngOnInit() {
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
        this.dataSrv.setMessage(message);
        this.router.navigateByUrl('/content');
    }
}
