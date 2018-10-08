import { SelectionModel } from '@angular/cdk/collections';

// App state
export interface AppState {
    loader: boolean;
    noResult: boolean;
    downloadStarted: boolean;
}

// Settings
export interface Settings {
    savePath: string;
    concurrentDownload: number;
}

// Message
export interface Message {
    type: MessageType;
    title: string;
    description: string;
}

export enum MessageType {
    NONE = 'NONE',
    INFO = 'INFO',
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS',
    CANCEL = 'CANCEL',
}

// Search list item and value
export interface Search {
    inputValue: string;
    items: Item[];
    selectedItems: SelectionModel<Item>;
}

export interface Item {
    id?: string;
    thumb?: string;
    duration?: number;
    title?: string;
    publishedAt?: string;
    selected?: boolean;
    status: ProgressStatus;
    progress?: Progress;
}

export interface Progress {
    percent: number;        // (floatDownloaded * 100).toFixed(2),
    downloaded: number;     // (downloaded / 1024 / 1024).toFixed(2),
    total: number;          // (total / 1024 / 1024).toFixed(2),
    mn: number;             // downloadedMinutes.toFixed(2),
    mnRest: number;         // (downloadedMinutes / floatDownloaded - downloadedMinutes).toFixed(2)
}

export enum ProgressStatus {
    NONE = 'NONE',
    STARTED = 'STARTED',
    PAUSED = 'PAUSED',
    PROGRESS = 'PROGRESS',
    ENDED = 'ENDED',
    CANCELLED = 'CANCELLED',
    ERROR = 'ERROR'
}
