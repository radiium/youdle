

import { app, ipcMain, BrowserWindow } from 'electron';
import * as ytdl from 'ytdl-core';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as _ from 'lodash';

import Logger from './logger';

interface Item {
    video: any;
    OUTPUT?: string;
}

interface Options {
    type: string;
    savePath: string;
}

export enum DownloadStatus {
    NONE = 'NONE',
    START = 'START',
    PROGRESS = 'PROGRESS',
    SUCCESS = 'SUCCESS',
    CANCEL = 'CANCEL',
    ERROR = 'ERROR'
}

export default class Download extends Logger {

    mainWindow: BrowserWindow;

    startedItems = [];
    options: Options;

    constructor(win: BrowserWindow, isDev) {
        super();
        this.mainWindow = win;
        this.setFfmpegPath(isDev);
        this.initListener();
    }

    public destroy() {
        this.removeListener();
    }

    private initListener() {
        ipcMain.on('start-download', this.startDownload.bind(this));
    }

    private removeListener() {
        ipcMain.removeListener('start-download', this.startDownload);
    }

    private startDownload(event: any, video: any, options: any) {

        this.options = options;

        const item: Item = {
            video: video,
        };

        this.log('startDownload', options);

        if (this.options.type === 'VIDEO') {
            item.OUTPUT = this.resolveOutput(options.savePath, video.title, '.mp4');
            this.createStream(item, { filter: (format) => format.container === 'mp4' });

        } else if (this.options.type === 'AUDIO') {
            item.OUTPUT = this.resolveOutput(options.savePath, video.title, '.mp3');
            this.createStream(item, { quality: 'highestaudio' });
        }

    }

    private createStream(item: Item, ytdlOptions: any) {

        const onDownload = (type: DownloadStatus, progress: any, err?: any) => {
            this.log(`[${type}] => ${item.video.id}`, progress, err);
            this.removeItems(item);
            this.mainWindow.webContents.send('onDownload', err, {
                item: item.video,
                status: type,
                progress: progress,
                error: err
            });
        };

        const cancel = () => {
            this.log(`[CANCEL] => ${item.video.id}`);
            if (readStream) {
                readStream.destroy(new Error(``));
            }
            if (ffmpegCmd) {
                ffmpegCmd.kill();
            }
            if (fs.existsSync(item.OUTPUT)) {
                fs.unlinkSync(item.OUTPUT);
            }
            if (fs.existsSync(item.OUTPUT + '.crdownload')) {
                fs.unlinkSync(item.OUTPUT + '.crdownload');
            }
        };

        const onError = (err: any) => {
            cancel();
            onDownload(DownloadStatus.ERROR, null, err);
        };

        /// Download (ytdl-core)

        // Download events
        let startDL: number;
        const onceDownloadResponse = (response: any) => {
            startDL = Date.now();
            this.startedItems.push(item);
            onDownload(DownloadStatus.START, null, null);
        };

        const onDownloadProgress = (chunkLength: number, downloaded: number, total: number) => {
            const progress = this.computeProgress(downloaded, total, startDL);
            onDownload(DownloadStatus.PROGRESS, progress, null);
        };

        const readStream = ytdl(item.video.id, ytdlOptions)
            .once('response', onceDownloadResponse.bind(this))
            .on('progress', onDownloadProgress.bind(this))
            .on('error', onError.bind(this))
            .on('finish', () => {
                const onConvertEnd = () => {
                    this.log(`[CONVERT_END] => video: ${item.video.id}`);
                    onDownload(DownloadStatus.SUCCESS, null, null);
                };

                if (this.options.type === 'VIDEO') {
                    ffmpegCmd = this.convertToMp4(item);

                } else if (this.options.type === 'AUDIO') {
                    ffmpegCmd = this.convertToMp3(item);
                }

                ffmpegCmd
                    .on('error', onError.bind(this))
                    .on('end', onConvertEnd.bind(this));
            })
            .pipe(fs.createWriteStream(item.OUTPUT + '.crdownload'));

        /// Convert (fluent-ffmpeg)

        // Convert events

        let ffmpegCmd: any;

        ipcMain.on('cancelDownload.' + item.video.id, (evt, arg) => {
            cancel();
            onDownload(DownloadStatus.CANCEL, null, null);
        });
    }

    private convertToMp4(item: Item, ) {
        return ffmpeg(item.OUTPUT + '.crdownload')
            .videoCodec('libx264')
            .videoBitrate('512k')
            .audioBitrate(192)
            .audioCodec('libmp3lame')
            .toFormat('mp4')
            .save(item.OUTPUT);
    }

    private convertToMp3(item: Item) {
        return ffmpeg(item.OUTPUT + '.crdownload')
            .audioBitrate(192)
            .audioCodec('libmp3lame')
            .toFormat('mp3')
            .save(item.OUTPUT);
    }

    private removeItems(item: Item) {
        this.startedItems = this.startedItems.filter((currItem: Item) => {
            return currItem.video.id !== item.video.id;
        });
    }

    // Compute download progress
    private computeProgress(downloaded: number, total: number, startDL: number) {
        const floatDownloaded = downloaded / total;
        const downloadedMinutes = (Date.now() - startDL) / 1000 / 60;
        return {
            percent: (floatDownloaded * 100).toFixed(2),
            downloaded: (downloaded / 1024 / 1024).toFixed(2),
            total: (total / 1024 / 1024).toFixed(2),
            mn: downloadedMinutes.toFixed(2),
            mnRest: (downloadedMinutes / floatDownloaded - downloadedMinutes).toFixed(2)
        };
    }

    // Resolve output file
    private resolveOutput(savePath: string, title: string, ext: string) {
        const fileName = this.sanitize(title, '') + ext;
        return path.resolve(savePath, fileName);
    }

    // Sanitize string
    private sanitize(input: string, replacement: string) {
        const illegalRe = /[\/\?<>\\:\*\|":]/g;
        const controlRe = /[\x00-\x1f\x80-\x9f]/g;
        const reservedRe = /^\.+$/;
        const windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
        const windowsTrailingRe = /[\. ]+$/;

        const sanitized = input
            .replace(illegalRe, replacement)
            .replace(controlRe, replacement)
            .replace(reservedRe, replacement)
            .replace(windowsReservedRe, replacement)
            .replace(windowsTrailingRe, replacement);
        return sanitized;
    }

    // Set ffmpeg binary path
    private setFfmpegPath(isDev: boolean) {
        let ffmpegPath = '';
        const platform = os.platform();
        const arch = 'x64'; // os.arch();
        const ffmpegName = (platform === 'win32') ? 'ffmpeg.exe' : 'ffmpeg';

        if (isDev) {
            ffmpegPath = path.resolve(
                app.getAppPath(),
                '..',
                'node_modules/ffmpeg-static/bin',
                platform,
                arch,
                ffmpegName
            );

        } else {
            ffmpegPath = path.join(process.resourcesPath, ffmpegName);
        }

        this.log('ffmpegPath', ffmpegPath);
        ffmpeg.setFfmpegPath(ffmpegPath);
    }
}
