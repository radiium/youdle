import { NgModule } from '@angular/core';
import { CoreStoreModule } from './stores/core-store.module';
import { ApiService } from '@core/services/api.service';
import { DialogService } from '@core/services/dialog.service';
import { NotificationService } from '@core/services/notification.service';
import { YoutubeService } from '@core/services/youtube.service';
import { UtilsService } from '@core/services/utils.service';
import { ElectronDownloadService } from '@core/services/electron/electron-download.service';
import { ElectronSavePathService } from '@core/services/electron/electron-save-path.service';
import { ElectronStorageService } from '@core/services/electron/electron-storage.service';

const SERVICES = [
    ApiService,
    DialogService,
    NotificationService,
    YoutubeService,
    UtilsService,
    ElectronDownloadService,
    ElectronSavePathService,
    ElectronStorageService
];

@NgModule({
    imports: [
        CoreStoreModule
    ],
    providers: [
        ...SERVICES
    ]
})
export class CoreModule { }
