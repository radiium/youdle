import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Item, ProgressStatus } from 'core/services/data.models';

@Component({
    selector: 'app-video-list-item',
    templateUrl: './video-list-item.component.html',
    styleUrls: ['./video-list-item.component.scss']
})
export class VideoListItemComponent implements OnInit {

    @Input() video: Item;
    @Output() videoChange = new EventEmitter();
    @Input() disableSelection: boolean;
    @Input() oddEvenClass: string;

    progressStatus = ProgressStatus;

    constructor() {}

    ngOnInit() {
        this.disableSelection = false;
    }

    onVideoChange() {
        this.videoChange.emit(this.video);
    }
}
