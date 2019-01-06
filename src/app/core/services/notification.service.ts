import { Injectable, NgZone } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

@Injectable()
export class NotificationService {
    constructor(
    private readonly snackBar: MatSnackBar,
    private readonly zone: NgZone) {}

    default(message: string) {
        this.show(message, {
            duration: 2000,
            panelClass: 'default-notification-overlay'
        });
    }

    info(message: string) {
        this.show(message, {
            duration: 2000,
            panelClass: 'info-notification-overlay'
        });
    }

    success(message: string) {
        this.show(message, {
            duration: 2000,
            panelClass: 'success-notification-overlay'
        });
    }

    warn(message: string) {
        this.show(message, {
            duration: 2500,
            panelClass: 'warning-notification-overlay'
        });
    }

    error(message: string) {
        this.show(message, {
            duration: 3000,
            panelClass: 'error-notification-overlay'
        });
    }

    private show(message: string, configuration: MatSnackBarConfig) {
        this.zone.run(() => this.snackBar.open(message, null, configuration));
    }
}
