import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';

import { SettingsDialogComponent } from '@shell/settings-dialog/settings-dialog.component';
import { MessageDialogComponent } from '@shell/message-dialog/message-dialog.component';

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
        console.log('openSettingsDialog');
        const dialog = this.dialog.open(SettingsDialogComponent, this.dialogConfig);
        dialog.afterClosed().subscribe(result => {
            // this.settingsdialogRef = null;
            this.dialog.closeAll();
        });
    }

    openMessageDialog(message) {
        console.log('openMessageDialog');
        this.dialogConfig.data.message = message;
        const dialog = this.dialog.open(MessageDialogComponent, this.dialogConfig);
        dialog.afterClosed().subscribe(result => {
            // this.messagedialogRef = null;
            this.dialog.closeAll();
        });
    }

}
