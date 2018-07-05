import { NgModule } from '@angular/core';
import { SettingsService } from 'core/services/settings.service';
import { AppStateService } from 'core/services/app-state.service';
import { YoutubeService } from 'core/services/youtube.service';
import { UtilsService } from 'core/services/utils.service';

@NgModule({
    imports: [],
    exports: [],
    declarations: [],
    providers: [
        SettingsService,
        AppStateService,
        YoutubeService,
        UtilsService
    ]
})
export class CoreModule { }
