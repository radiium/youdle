import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxElectronModule } from 'ngx-electron';
import { MatIconRegistry, MatIconModule } from '@angular/material';

import { CustomMaterialModule } from './modules/material/custom-material.module';
import { VideoListItemComponent } from './components/video-list-item/video-list-item.component';
import { LoaderComponent } from './components/loader/loader.component';
import { DurationPipe } from './pipes/duration.pipe';

@NgModule({
    entryComponents: [
    ],
    declarations: [
        VideoListItemComponent,
        LoaderComponent,
        DurationPipe
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        HttpClientJsonpModule,
        NoopAnimationsModule,
        // BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        NgxElectronModule,
        MatIconModule,
        CustomMaterialModule
    ],
    exports: [
        CommonModule,
        NoopAnimationsModule,
        // BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        NgxElectronModule,
        MatIconModule,
        CustomMaterialModule,
        VideoListItemComponent,
        LoaderComponent,
        DurationPipe
    ],
    providers: [],
})
export class SharedModule {
    constructor(
    matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer) {
        matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl('./assets/icons/mdi.svg'));
    }
}