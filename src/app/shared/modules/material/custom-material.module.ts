import { NgModule,  } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatButtonModule } from '@angular/material/button';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const matModule = [
    OverlayModule,
    MatButtonModule,
    MatPseudoCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MatToolbarModule
];


@NgModule({
    imports: [
        ...matModule
    ],
    exports: [
        ...matModule
    ],
    declarations: []
})
export class CustomMaterialModule { }
