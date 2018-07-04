import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EMPTY, Observable, forkJoin} from 'rxjs';
import { expand, pluck, scan, last, map, flatMap } from 'rxjs/operators';
// import * as _ from 'lodash';
import { PUBLIC_KEY } from './public-key';

@Injectable()
export class YoutubeService {

    private ENDPOINT = 'https://www.googleapis.com/youtube/v3';
    maxResult = 50;

    constructor(
        private http: HttpClient
    ) { }


    // ------------------------------------------------------------------------
    // Get all playlist of user
    getPlaylists(plId): Observable<any> {
        const queryUrl =
            this.ENDPOINT +
            '/playlists' +
            '?part=snippet,status' +
            '&maxResults=' + this.maxResult +
            '&id=' + plId +
            '&key=' + PUBLIC_KEY;

            return this.http.get<any>(queryUrl, this.getHeaders());
    }

    // ------------------------------------------------------------------------
    // Get playlist items
    getPlaylistItems(playlistId: string, pageToken: string): Observable<any> {

        if (typeof pageToken === 'undefined') {
            return EMPTY;
        }

        let queryUrl =
            this.ENDPOINT +
            '/playlistItems' +
            '?playlistId=' + playlistId +
            '&part=snippet,contentDetails' +
            '&maxResults=' + this.maxResult +
            '&key=' + PUBLIC_KEY;

        if (pageToken) {
            queryUrl += '&pageToken=' + pageToken;
        }

        return this.http.get<any>(queryUrl, this.getHeaders());
    }

    getVideosById(videosId: string) {
        const queryUrl =
            this.ENDPOINT +
            '/videos' +
            '?part=snippet,contentDetails,status' +
            '&id=' + videosId +
            '&key=' + PUBLIC_KEY;

        return this.http.get(queryUrl);
    }

    fetchYoutubePlaylists(plId) {

        return this.getPlaylistItems(plId, '').pipe(
            // Recursive call for playlist items
            expand((data: any) => this.getPlaylistItems(plId, data.nextPageToken), 1),
            // Group each response by 'items' field
            pluck('items'),
            // Concat each items in array
            scan((array: any, data) => {
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        array.push(data[key]);
                    }
                }
                return array;
            }, []),
            last(),
            flatMap((plItemsList) => {

                // Parse videos id
                const videoIdList = this.parseVideoId(plItemsList);
                const aReq = [];

                // Get videos metadatas
                videoIdList.forEach((videoIds) => {
                    const reqVideo = this.getVideosById(videoIds);
                    aReq.push(reqVideo);
                });

                return forkJoin(aReq).pipe(
                    // Parse videos metadatas in video object
                    map((res) => {
                        const videoList = [];
                        res.forEach((el: any, index) => {
                            el.items.forEach(video => {
                                if (video.status.embeddable) {
                                    // const objVideo = this.parseVideo(video);
                                    // videoList.push(objVideo);
                                    videoList.push(video);
                                }
                            });
                        });

                        // Create playlist object
                        return videoList; // this.parsePlaylist(playlist, videoList);
                    })
                );
            })
        );
    }


    // Get all video id from an array of playlist items
    parseVideoId(playlistItemsList) {
        const videosIdList = [];
        for (const key in playlistItemsList) {
            if (playlistItemsList.hasOwnProperty(key)) {
                const videoId = playlistItemsList[key].snippet.resourceId.videoId;
                videosIdList.push(videoId);
            }
        }
        return this.concatVideoIdBy50(videosIdList);
    }

    // Set videos id list to array of string
    // Each string contains a maximum of 50 videos id
    concatVideoIdBy50(videosIdList) {
        const aVideoId = [];
        do {
            aVideoId.push(videosIdList.slice(0, 50).join(','));
            videosIdList = videosIdList.slice(50);

        } while (videosIdList.length !== 0);
        return aVideoId;
    }


    private getHeaders() {
        let headers = new HttpHeaders();
        headers = headers.append('Content-type',  'application/x-www-form-urlencoded');
        headers = headers.append('Accept', 'application/json');
        return {headers: headers};
    }

}
