import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContentComponent } from './components/content/content.component';
import { SettingsComponent } from './components/settings/settings.component';
import { MessageComponent } from './components/message/message.component';

const routes: Routes = [
    { path: '',  redirectTo: '/content', pathMatch: 'full' },
    { path: 'content', component: ContentComponent },
    { path: 'settings', component: SettingsComponent },
    { path: 'message', component: MessageComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})
export class AppRoutingModule {}
