import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule, MatIconRegistry} from '@angular/material/icon';

import { CustomMaterialModule } from './modules/material/custom-material.module';
import { DurationPipe } from './pipes/duration.pipe';

const mdi = require('@mdi/angular-material/mdi.svg') as string;


@NgModule({
    entryComponents: [
    ],
    declarations: [
        DurationPipe
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        HttpClientJsonpModule,
        // NoopAnimationsModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        CustomMaterialModule
    ],
    exports: [
        CommonModule,
        // NoopAnimationsModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        CustomMaterialModule,
        DurationPipe
    ],
    providers: [],
})
export class SharedModule {
    constructor(
    matIconRegistry: MatIconRegistry,
    domSanitizer: DomSanitizer) {
        matIconRegistry.addSvgIconSet(domSanitizer.bypassSecurityTrustResourceUrl(mdi));
    }
}
