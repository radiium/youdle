import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { YoutubeVideo } from 'shared/models';

@Component({
    selector: 'app-video-list-item',
    templateUrl: './video-list-item.component.html',
    styleUrls: ['./video-list-item.component.scss']
})
export class VideoListItemComponent {

    @Input() video: YoutubeVideo;
    @Output() videoChange = new EventEmitter();
    @Input() disableSelection: boolean;
    @Input() oddEvenClass: string;

    constructor() {
        this.disableSelection = false;
    }

    onVideoChange() {
        this.videoChange.emit(this.video);
    }
}
