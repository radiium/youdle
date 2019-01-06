import { NgModule } from '@angular/core';

import { SharedModule } from '@shared/shared.module';
import { ShellComponent } from '@shell/shell/shell.component';
import { SettingsDialogComponent } from '@shell/settings-dialog/settings-dialog.component';
import { MessageDialogComponent } from '@shell/message-dialog/message-dialog.component';
import { VideoListComponent } from '@shell/video-list/video-list.component';
import { LoaderComponent } from '@shell/loader/loader.component';

@NgModule({
    entryComponents: [
        SettingsDialogComponent,
        MessageDialogComponent,
    ],
    declarations: [
        ShellComponent,
        SettingsDialogComponent,
        MessageDialogComponent,
        VideoListComponent,
        LoaderComponent,
    ],
    imports: [
        SharedModule
    ],
    exports: [
        ShellComponent
    ],
    providers: [
    ],
})

export class ShellModule {
}
