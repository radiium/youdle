import { NgModule } from '@angular/core';
import { AppStateService } from 'core/services/app-state.service';
import { SettingsService } from 'core/services/settings.service';
import { VideoListService } from 'core/services/video-list.service';
import { YoutubeService } from 'core/services/youtube.service';
import { UtilsService } from 'core/services/utils.service';

@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [
        AppStateService,
        SettingsService,
        VideoListService,
        YoutubeService,
        UtilsService
    ]
})
export class CoreModule { }
