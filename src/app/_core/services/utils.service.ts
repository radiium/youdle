import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';

import { DataService } from 'core/services/data.service';
import { YoutubeService } from 'core/services/youtube.service';
import { YoutubeVideo, ProgressStatus } from 'shared/models/youtube-video';
import { ElectronService } from 'ngx-electron';
import { AppState } from 'shared/models/app-state';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    appState: AppState;
    videoList: YoutubeVideo[];

    constructor(
    private electronSrv: ElectronService,
    private datateSrv: DataService,
    private ytSrv: YoutubeService) {
        this.datateSrv.appState$.subscribe((data) => {
            this.appState = data;
            // this.updateHeight();
        });

        this.datateSrv.videoList$.subscribe((data) => {
            this.videoList = data;
        });

        // this.parseInputValue('https://www.youtube.com/watch?list=PL0k4GF1e6u1T9kUYx9ppyGvCS9EcvaCM2');

        /*
        this.electronSrv.ipcRenderer.on('sendClipboardValue', (event, clipboardValue) => {
            console.log('sendClipboardValue=>', clipboardValue);
            this.dataSrv.setInputValue(clipboardValue);
            this.parseInputValue(clipboardValue);
        });
        */


    }

    parseInputValue(value) {

        this.datateSrv.setloader(true);

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
                    console.log('getVideosById');
                    if (data && data.items[0]) {
                        videoList.push(this.parseVideo(data.items[0], true));
                    }
                    this.updateContent(videoList, value);
                },
                (err) => this.updateContent([], value));

        } else if (resource && resource.type === 'playlist') {
            this.ytSrv.fetchYoutubePlaylists(resource.id).subscribe(
                (data: any) => {
                    console.log('getPlaylists');
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
        this.datateSrv.setVideoList(videoList);
        this.datateSrv.setloader(false);

        const notFound = ((videoList && videoList.length === 0) && (value && value.length > 0));
        this.datateSrv.setNotFound(notFound);
    }

    updateHeight() {
        let height;
        if (this.appState.selectedTab === 0) {
            if (this.videoList.length === 0) {
                height = 100;
            } else if (this.videoList.length === 1) {
                height = 160;
            } else if (this.videoList.length > 1) {
                height = 370;
            }
        } else if (this.appState.selectedTab === 1) {
            height = 160;
        }

        this.setWindowHeight(height);
    }

    setWindowHeight(height) {
        const win = this.electronSrv.remote.getCurrentWindow();
        const screenHeight = this.electronSrv.screen.getPrimaryDisplay().workAreaSize.height;

        const currentWidth = win.getSize()[0];
        const currentHeight = win.getSize()[1];

        if (currentHeight < screenHeight) {
            win.setSize(currentWidth, height);
        }
    }

    validUrl(str) {
        return /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(str);
    }

    extractID(url) {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        const match = url.match(regExp);
        let list = url.match('list=([a-zA-Z0-9\-\_]+)&?');
        list = list ? list[1] : '';

        if (match && match[7].length === 11) {
            // console.log('extractID video', match[7]);
            return { type: 'video', id: match[7] };
        } else if (list !== '') {
            // console.log('extractID playlist', list);
            return { type: 'playlist', id: list };
        } else {
            // console.log('Could not extract video ID.');
            return null;
        }
    }

    parseVideo(data, preSelect): YoutubeVideo {
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
