import { Injectable, isDevMode } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';

import { DataService } from 'core/services/data.service';
import { YoutubeService } from 'core/services/youtube.service';
import { ElectronService } from 'ngx-electron';
import { AppState, Search, Item, ProgressStatus } from 'core/services/data.models';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    appState: AppState;
    search: Search;

    constructor(
    private electronSrv: ElectronService,
    private datateSrv: DataService,
    private ytSrv: YoutubeService) {

        this.datateSrv.appState$.subscribe((data) => {
            this.appState = data;
        });

        this.datateSrv.search$.subscribe((data) => {
            this.search = data;
        });

        // Dev sample youtube url
        if (isDevMode) {
            // this.parseInputValue('https://www.youtube.com/watch?list=PL0k4GF1e6u1T9kUYx9ppyGvCS9EcvaCM2');
            this.parseInputValue('https://www.youtube.com/watch?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj');
        }
    }

    parseInputValue(value) {

        this.datateSrv.setLoader(true);

        let videoList = [];
        let resource = this.extractID(value);

        if (!resource) {
            if (value.length === 11) {
                resource = { type: 'video', id: value };
            } else if (value.length === 34) {
                resource = { type: 'playlist', id: value };
            }
        }

        if (resource && resource.type === 'video') {
            this.ytSrv.getVideosById(resource.id).subscribe(
                (data: any) => {
                    // console.log('getVideosById');
                    if (data && data.items[0]) {
                        videoList.push(this.parseVideo(data.items[0], true));
                    }
                    this.updateContent(videoList, value);
                },
                (err) => this.updateContent([], value));

        } else if (resource && resource.type === 'playlist') {
            this.ytSrv.fetchYoutubePlaylists(resource.id).subscribe(
                (data: any) => {
                    // console.log('getPlaylists');
                    if (data && data.length > 0) {
                        videoList = _.map(data, (video) => {
                            return this.parseVideo(video, false);
                        });
                    }
                    this.updateContent(videoList, value);
                },
                (err) => this.updateContent([], value));
        }

        if (!resource) {
            this.updateContent([], value);
        }
    }

    updateContent(videoList, value) {
        if (videoList.length === 1) {
            videoList[0].selected = true;
        }
        this.datateSrv.setItems(videoList);
        this.datateSrv.setLoader(false);

        const noResult = ((videoList && videoList.length === 0) && (value && value.length > 0));
        this.datateSrv.setNoResult(noResult);
    }

    validUrl(str) {
        return /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(str);
    }

    extractID(url) {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        const match = url.match(regExp);
        let list = url.match('list=([a-zA-Z0-9\-\_]+)&?');
        list = list ? list[1] : '';

        if (list !== '') {
            // console.log('extractID playlist', list);
            return { type: 'playlist', id: list };
        } else if (match && match[7].length === 11) {
            // console.log('extractID video', match[7]);
            return { type: 'video', id: match[7] };
        } else {
            // console.log('Could not extract video ID.');
            return null;
        }
    }

    parseVideo(data, preSelect): Item {
        return {
            id: data.id,
            title: _.deburr(data.snippet.localized.title),
            thumb: data.snippet.thumbnails.default.url,
            duration: moment.duration(data.contentDetails.duration).asMilliseconds(),
            publishedAt: data.snippet.publishedAt,
            selected: preSelect,
            status: ProgressStatus.NONE,
            progress: null
        };
    }
}
