import { Injectable, isDevMode } from '@angular/core';
import * as moment from 'moment';
import * as _ from 'lodash';

import { VideoListItem, ProgressStatus } from '@core/stores/video-list';

@Injectable()
export class UtilsService {

    constructor() {

        // Dev sample youtube url
        if (isDevMode()) {
            // this.parseInputValue('https://www.youtube.com/watch?list=PL0k4GF1e6u1T9kUYx9ppyGvCS9EcvaCM2');
            // this.parseInputValue('https://www.youtube.com/watch?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj');
        }
    }

    validUrl(str) {
        return /^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(str);
    }

    extractResource(str) {
        let data;
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        const match = str.match(regExp);
        let list = str.match('list=([a-zA-Z0-9\-\_]+)&?');
        list = list ? list[1] : '';

        if (list !== '' && list.length === 34) {
            data = { type: 'PLAYLIST', id: list };
        } else if (match && match[7].length === 11) {
            data = { type: 'VIDEO', id: match[7] };
        } else {
            data = { type: 'EMPTY', id: '' };
        }
        return data;
    }

    parseVideoList(data) {
        const selected = (data && data.length === 1);
        const videoList = _.map(data, (video) => {
            return this.parseVideo(video, selected);
        });
        return videoList || [];
    }

    parseVideo(data, preSelect): VideoListItem {
        return {
            id: data.id,
            selected: preSelect,
            title: _.deburr(data.snippet.localized.title),
            description: _.deburr(data.snippet.localized.description),
            channelTitle: data.snippet.channelTitle,
            thumb: data.snippet.thumbnails.default.url,
            duration: moment.duration(data.contentDetails.duration).asMilliseconds(),
            publishedAt: data.snippet.publishedAt,
            status: ProgressStatus.NONE,
            progress: null
        };
    }
}
