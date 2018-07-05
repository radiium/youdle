import { Injectable } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';

import { AppStateService } from 'core/services/app-state.service';
import { VideoListService } from 'core/services/video-list.service';
import { YoutubeService } from 'core/services/youtube.service';
import { YoutubeVideo } from 'shared/models/youtube-video';
import { ElectronService } from 'ngx-electron';
import { AppState } from 'shared/models/app-state';

@Injectable({
    providedIn: 'root'
})
export class UtilsService {

    appState: AppState;

    constructor(
    private electronSrv: ElectronService,
    private appStateSrv: AppStateService,
    private videoListSrv: VideoListService,
    private ytSrv: YoutubeService) {
        this.appStateSrv.appState$.subscribe((data) => {
            this.appState = data;
            // this.updateHeight();
        });

        /*
        this.electronSrv.ipcRenderer.on('sendClipboardValue', (event, clipboardValue) => {
            console.log('sendClipboardValue=>', clipboardValue);
            this.dataSrv.setInputValue(clipboardValue);
            this.parseInputValue(clipboardValue);
        });
        */


    }

    loadOsType() {
        this.electronSrv.ipcRenderer.send('getOsType');
        this.electronSrv.ipcRenderer.on('getOsTypeResp', (event, osType) => {
            if (osType === 'darwin') {
                this.appStateSrv.setMacOsTitleBar(true);
            }
        });
    }

    parseInputValue(value) {

        this.appStateSrv.setloader(true);

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
                        videoList.push(this.parseVideo(data.items[0], 0));
                    }
                    this.updateContent(videoList, value);
                },
                (err) => this.updateContent([], value));

        } else if (resource && resource.type === 'playlist') {
            this.ytSrv.fetchYoutubePlaylists(resource.id).subscribe(
                (data: any) => {
                    console.log('getPlaylists');
                    if (data && data.length > 0) {
                        let count = -1;
                        videoList = _.map(data, (video) => {
                            return this.parseVideo(video, ++count);
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
        videoList[0].selected = videoList.length === 1 ? true : false;
        this.videoListSrv.setVideoList(videoList);
        this.appStateSrv.setloader(false);

        const notFound = ((videoList && videoList.length === 0) && (value && value.length > 0));
        this.appStateSrv.setNotFound(notFound);
    }

    updateHeight() {
        let height;
        if (this.appState.selectedTab === 0) {
            if (this.appState.videoList.length === 0) {
                height = 100;
            } else if (this.appState.videoList.length === 1) {
                height = 160;
            } else if (this.appState.videoList.length > 1) {
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

        if (this.appState.macOsTitleBar) {
            height += 25;
        }

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

    parseVideo(data, index): YoutubeVideo {
        return {
            index: index,
            id: data.id,
            title: _.deburr(data.snippet.localized.title),
            thumb: data.snippet.thumbnails.default.url,
            duration: moment.duration(data.contentDetails.duration).asMilliseconds(),
            publishedAt: data.snippet.publishedAt,
            selected: false
        };
    }
}
