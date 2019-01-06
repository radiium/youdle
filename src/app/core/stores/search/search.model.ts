import { SelectionModel } from '@angular/cdk/collections';

export interface SearchState {
    inputValue: string;
    resource: Resource;
}

export interface Resource {
    type: ResourceType;
    id: string;
}

export enum ResourceType {
    EMPTY = 'EMPTY',
    VIDEO = 'VIDEO',
    PLAYLIST = 'PLAYLIST',
}

