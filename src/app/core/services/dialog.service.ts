import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { SettingsDialogComponent } from '@shell/settings-dialog/settings-dialog.component';
import { MessageDialogComponent } from '@shell/message-dialog/message-dialog.component';
import { Message } from '@core/models';

@Injectable({
    providedIn: 'root'
})
export class DialogService {

    dialogConfig = {
        /*
        maxWidth: '100vw',
        maxHeight: '100vh',
        */
        height: '90%',
        width: '90%',
        panelClass: ['customDialogWrapper'],
        data: {
            message: null
        }
    };

    constructor(
    public dialog: MatDialog) {
    }

    // closeAll()
    openSettingsDialog() {
        const dialogRef = this.dialog.open(SettingsDialogComponent, this.dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            this.dialog.closeAll();
        });
    }

    openMessageDialog(message: Message, callback?: Function) {
        console.log('openMessageDialog');
        this.dialogConfig.data.message = message;
        const dialogRef = this.dialog.open(MessageDialogComponent, this.dialogConfig);
        dialogRef.afterClosed().subscribe(result => {
            this.dialog.closeAll();
            if (callback) {
                callback();
            }
        });
    }

}
