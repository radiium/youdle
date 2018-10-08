import { NgModule } from '@angular/core';
import { DataService } from 'core/services/data.service';
import { YoutubeService } from 'core/services/youtube.service';
import { UtilsService } from 'core/services/utils.service';
import { ElectronService } from 'core/services/electron.service';

@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [
        DataService,
        YoutubeService,
        UtilsService,
        ElectronService
    ]
})
export class CoreModule { }
