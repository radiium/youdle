import { NgModule,  } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatTabsModule,
    MatToolbarModule
} from '@angular/material';
import { OverlayModule } from '@angular/cdk/overlay';


@NgModule({
    imports: [
    ],
    exports: [
        CommonModule,
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatTabsModule,
        MatToolbarModule,
        OverlayModule
    ],
    declarations: []
})
export class CustomMaterialModule { }
