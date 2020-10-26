import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';

import { SearchState } from '@stores/search';
import { VideoListItem } from '@stores/video-list';
import { ApiService } from '@core/services/api.service';
import { AppState } from '@core/stores/app-state';

@Component({
    selector: 'app-video-list',
    templateUrl: './video-list.component.html',
    styleUrls: ['./video-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VideoListComponent implements OnInit {
    count = {
        selected: 0,
        finished: 0
    };

    appState: AppState;
    searchState: SearchState;

    displayedColumns: string[] = ['selected', 'thumbnail', 'meta', 'title'];
    dataSource: VideoListItem[] = [];
    selection = new SelectionModel<VideoListItem>(true, []);

    constructor(
    private cdRef: ChangeDetectorRef,
    private apiSrv: ApiService,
    ) {}

    ngOnInit() {
        this.apiSrv.getAppState().subscribe(data => {
            this.appState = data;
            this.cdRef.detectChanges();
        });

        this.apiSrv.getSearchState().subscribe(data => {
            this.searchState = data;
            this.cdRef.detectChanges();
        });

        this.apiSrv.getItems().subscribe(data => {
            this.dataSource = data;
            if (data.length === 1) {
                this.selection.select(data[0]);
                this.apiSrv.setSelectedItems(this.selection.selected);
            }
            this.cdRef.detectChanges();
        });

        this.apiSrv.getSelectedItems().subscribe(data => {
            this.selection = new SelectionModel<VideoListItem>(true, data);
            this.cdRef.detectChanges();
        });
    }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.forEach(row => this.selection.select(row));
        this.apiSrv.setSelectedItems(this.selection.selected);
        this.cdRef.detectChanges();
    }

    itemToggle(item: VideoListItem, event: any) {
        if (event && this.dataSource.length > 1) {
            this.selection.toggle(item);
            this.apiSrv.setSelectedItems(this.selection.selected);
            this.cdRef.detectChanges();
        }
    }

    startDownload() {
        this.apiSrv.startDownload();
    }

    cancelDownload() {
        this.apiSrv.cancelDownload();
    }
}
