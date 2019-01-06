import { Component, Inject, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { Store, select } from '@ngrx/store';
// import { MessageState } from '@core/stores/message';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-message-dialog',
    templateUrl: './message-dialog.component.html',
    styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit, OnDestroy {

    // messageState: MessageState;
    subscription = new Subscription();
    messageState;

    constructor(
    private cdRef: ChangeDetectorRef,
    private store: Store<any>,
    public dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
        this.messageState = data.message;
        console.log('data', data);
    }

    ngOnInit() {
        /*
        this.store.select('MessageState').subscribe((data) => {
            this.messageState = data;
            this.cdRef.detectChanges();
        });
        */
    }

    ngOnDestroy() {
        // this.subscription.unsubscribe();
    }
}
