import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { rootReducer } from './reducers/root.reducer';
import { metaReducers } from './reducers/meta.reducer';
import { environment } from '@env/environment';
import { EffectsModule } from '@ngrx/effects';
import { SearchEffects } from './search/search.effects';
import { VideoListEffects } from './video-list/video-list.effects';
import { SettingsEffects } from './settings';

@NgModule({
    imports: [
        StoreModule.forRoot(rootReducer, {
            metaReducers: metaReducers
        }),
        EffectsModule.forRoot([
            SearchEffects,
            SettingsEffects,
            VideoListEffects
        ]),
        StoreDevtoolsModule.instrument({
            maxAge: 25,
            logOnly: environment.production,
        })
    ],
    declarations: [],
    exports: [],
    providers: []
})
export class CoreStoreModule {}
