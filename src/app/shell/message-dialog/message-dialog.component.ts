import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Message } from '@core/models';

@Component({
    selector: 'app-message-dialog',
    templateUrl: './message-dialog.component.html',
    styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent {

    message: Message;

    constructor(
    public dialogRef: MatDialogRef<MessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
        this.message = data.message;
    }
}
