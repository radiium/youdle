import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

export interface VideoListState {
    items: VideoListItem[];
    selectedItems: VideoListItem[];
}

export interface VideoListItem {
    id: string;
    selected: boolean;
    thumb: string;
    duration: number;
    publishedAt: string;
    title: string;
    description: string;
    channelTitle: string;

    status: ProgressStatus;
    progress: Progress;
}

/*
status: ProgressStatus;
progress?: Progress;
*/
export enum ProgressStatus {
    NONE = 'NONE',
    STARTED = 'STARTED',
    PROGRESS = 'PROGRESS',
    ENDED = 'ENDED',
    CANCELLED = 'CANCELLED',
    ERROR = 'ERROR'
}

export interface Progress {
    percent: number;        // (floatDownloaded * 100).toFixed(2),
    downloaded: number;     // (downloaded / 1024 / 1024).toFixed(2),
    total: number;          // (total / 1024 / 1024).toFixed(2),
    mn: number;             // downloadedMinutes.toFixed(2),
    mnRest: number;         // (downloadedMinutes / floatDownloaded - downloadedMinutes).toFixed(2)
}
