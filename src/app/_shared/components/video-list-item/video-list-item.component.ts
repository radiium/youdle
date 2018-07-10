import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { YoutubeVideo } from 'shared/models';

@Component({
    selector: 'app-video-list-item',
    templateUrl: './video-list-item.component.html',
    styleUrls: ['./video-list-item.component.scss']
})
export class VideoListItemComponent implements OnChanges {

    @Input() video: YoutubeVideo;
    @Output() videoChange = new EventEmitter();
    @Input() disableSelection: boolean;
    @Input() oddEvenClass: string;

    constructor() {
        this.disableSelection = false;
    }

    ngOnChanges(changes) {
        // console.log('ngOnChanges', changes);
    }

    onVideoChange() {
        this.videoChange.emit(this.video);
    }
}
