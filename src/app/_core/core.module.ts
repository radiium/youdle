import { NgModule } from '@angular/core';
import { DataService } from 'core/services/data.service';
import { YoutubeService } from 'core/services/youtube.service';
import { UtilsService } from 'core/services/utils.service';

@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [
        DataService,
        YoutubeService,
        UtilsService
    ]
})
export class CoreModule { }
