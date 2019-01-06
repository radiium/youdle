import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CoreModule } from '@core/core.module';
import { SharedModule } from '@shared/shared.module';
import { ShellModule } from '@shell/shell.module';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        CoreModule,
        SharedModule,
        ShellModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
