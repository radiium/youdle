import { Component, OnInit } from '@angular/core';
import { DataService } from 'core/services/data.service';
import { YoutubeVideo } from 'shared/models/youtube-video';
import * as _ from 'lodash';
import { SelectionModel } from '@angular/cdk/collections';
import { AppState } from 'shared/models/app-state';

@Component({
    selector: 'app-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

    selection = new SelectionModel<YoutubeVideo>(true, []);
    appState: AppState;

    constructor(
    private dataSrv: DataService) {
        this.dataSrv.appState$.subscribe((data) => {
            this.appState = data;
            if (this.appState.videoList && this.appState.videoList.length === 1) {
                this.appState.videoList[0].selected = true;
            }
        });
    }

    ngOnInit() {
    }

    isAllSelected() {
        return this.appState.videoList.length === this.selection.selected.length;
    }

    masterToggle() {
        this.isAllSelected()
            ? this.selection.clear()
            : _.forEach(this.appState.videoList, (video) => this.selection.select(video));
    }

    download() {
        const selected = this.selection.selected;
        console.log('download', selected);
    }

    trackByFn(index, item) {
        return item.index;
    }
}
