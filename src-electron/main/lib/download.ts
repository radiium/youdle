

import { app, ipcMain, BrowserWindow } from 'electron';
import * as ytdl from 'ytdl-core';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as _ from 'lodash';

import videoPreset from './presets/video';
import audioPreset from './presets/audio';

import Logger from './logger';
import { Readable } from 'stream';

interface Item {
    video: any;
    OUTPUT: string;
    EXT?: string;
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

    constructor(win: BrowserWindow, isDev: boolean) {
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

        this.log(`[INIT] => ${video.id}`);

        this.options = options;
        const FILENAME: string = this.resolveOutput(options.savePath, video.title);

        let PARTIAL: string;
        let OUTPUT: string;
        let ytdlOptions: any;
        let preset: (ffmpegCmd: any) => void;

        if (this.options.type === 'VIDEO') {
            PARTIAL = FILENAME + '.crdownload';
            OUTPUT = FILENAME + 'mp4';
            ytdlOptions = { quality: 'highestvideo' };
            preset = videoPreset;

        } else if (this.options.type === 'AUDIO') {
            PARTIAL = FILENAME + '.crdownload';
            OUTPUT  = FILENAME + '.mp3';
            ytdlOptions = { quality: 'highestaudio' };
            preset = audioPreset;
        }

        const onDownload = (type: DownloadStatus, progress: any, err?: any) => {
            // this.log(`[${type}] => ${item.video.id}`, progress, err);
            this.removeItems(video);
            this.mainWindow.webContents.send('onDownload', err, {
                item: video,
                status: type,
                progress: progress,
                error: err
            });
        };

        const cancel = () => {
            this.log(`[CANCEL] => ${video.id}`);
            if (readStream) {
                readStream.destroy(new Error(``));
            }
            if (ffmpegCmd) {
                ffmpegCmd.kill();
            }
            if (fs.existsSync(PARTIAL)) {
                fs.unlinkSync(PARTIAL);
            }
            if (fs.existsSync(OUTPUT)) {
                fs.unlinkSync(OUTPUT);
            }
        };

        // Download/Convert Events
        let startDL: number;
        const onceDownloadResponse = (response: any) => {
            this.log(`[START] => ${video.id}`);
            startDL = Date.now();
            this.startedItems.push(video);
            onDownload(DownloadStatus.START, null, null);
        };

        let log = true;
        const onDownloadProgress = (chunkLength: number, downloaded: number, total: number) => {
            const progress = this.computeProgress(downloaded, total, startDL, video.id);
            if (log) {
                this.log(`[PROGRESS] => ${video.id}`, progress);
                log = false;
            }
            onDownload(DownloadStatus.PROGRESS, progress, null);
        };

        const onConvertEnd = () => {
            this.log(`[CONVERT_END] => video: ${video.id}`);
            if (fs.existsSync(PARTIAL)) {
                fs.renameSync(PARTIAL, OUTPUT);
            }
            onDownload(DownloadStatus.SUCCESS, null, null);
        };

        const onError = (err: any) => {
            this.log(`[ERROR] => ${video.id}`);
            cancel();
            onDownload(DownloadStatus.ERROR, null, err);
        };

        /// Download (ytdl-core)
        const readStream = ytdl(video.id, ytdlOptions)
            .once('response', onceDownloadResponse.bind(this))
            .on('progress', onDownloadProgress.bind(this))
            .on('error', onError.bind(this))
            .on('finish', () => { });

        /// Convert (fluent-ffmpeg)
        // Convert ytdl Readable stream with ffmpeg
        const ffmpegCmd = ffmpeg(readStream, { presets: './presets' })
            .preset(preset)
            .on('error', onError.bind(this))
            .on('end', onConvertEnd.bind(this))
            .save(PARTIAL);

        // On cancel video
        ipcMain.on('cancel-download.' + video.id, (evt, arg) => {
            cancel();
            onDownload(DownloadStatus.CANCEL, null, null);
            ipcMain.removeListener('cancel-download.' + video.id, this.startDownload);
        });
    }

    private removeItems(video: any) {
        this.startedItems = this.startedItems.filter((vid) => {
            return vid.id !== video.id;
        });
    }

    // Compute download progress
    private computeProgress(downloaded: number, total: number, startDL: number, id: string) {
        const floatDownloaded = downloaded / total;
        const downloadedMinutes = (Date.now() - startDL) / 1000 / 60;
        const progress = {
            percent: (floatDownloaded * 100).toFixed(2),
            downloaded: (downloaded / 1024 / 1024).toFixed(2),
            total: (total / 1024 / 1024).toFixed(2),
            mn: downloadedMinutes.toFixed(2),
            mnRest: (downloadedMinutes / floatDownloaded - downloadedMinutes).toFixed(2)
        };
        this.log(`${id}: ${progress.percent}% - ${progress.downloaded}/${progress.total} - ${progress.mnRest}/${progress.mn}`);
        return progress;
    }

    // Resolve output file
    private resolveOutput(savePath: string, title: string) {
        const fileName = this.sanitize(title, '');
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
