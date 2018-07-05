import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';

import { YoutubeVideo } from 'shared/models/youtube-video';

@Injectable({
    providedIn: 'root'
})
export class VideoListService {

    private videoList  = new BehaviorSubject<YoutubeVideo[]>([]);
    public  videoList$ = this.videoList.asObservable();

    constructor() {
    }

    setVideoList(data) {
        this.videoList.next(_.cloneDeep(data));
    }
}
