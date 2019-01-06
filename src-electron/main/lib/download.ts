

import { app, ipcMain, BrowserWindow } from 'electron';
import * as ytdl from 'ytdl-core';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as _ from 'lodash';

import Logger from './logger';
import { Readable } from 'stream';


interface Item {
    video?: any;
    type: string;
    OUTPUT?: string;
}

interface Options {
    type: string;
    savePath: string;
}

enum EndType {
    ERROR = 'ERROR',
    SUCCESS = 'SUCCESS',
    CANCEL = 'CANCEL',
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
            type: options.type
        };

        if (options.type === 'VIDEO') {
            item.OUTPUT = this.resolveOutput(options.savePath, video.title, '.mp4');
            this.createStream(item, { filter: (format) => format.container === 'mp4' });

        } else if (options.type === 'audio') {
            item.OUTPUT = this.resolveOutput(options.savePath, video.title, '.mp3');
            this.createStream(item, { quality: 'highestaudio' });
        }

    }

    private createStream(item: Item, ytdlOptions: any) {

        const end = (type: EndType, err?: any) => {
            this.log(`[END_${type}] => ${item.video.id}`);
            this.removeItems(item);
            this.mainWindow.webContents.send('onDownloadEnd', {
                id: item.video.id,
                type: type,
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
            end(EndType.ERROR, err);
        };

        /// Download (ytdl-core)

        // Download events
        let startDL: number;
        const onceDownloadResponse = (response: any) => {
            this.log(`[DOWNLOAD_START] => ${item.video.id}`);
            startDL = Date.now();
            this.startedItems.push(item);
            this.mainWindow.webContents.send('onDownloadStart', { id: item.video.id });
        };

        const onDownloadProgress = (chunkLength: number, downloaded: number, total: number) => {
            this.log(`[DOWNLOAD_PROGRESS] => ${item.video.id}`);
            const data = this.computeProgress(downloaded, total, startDL, item.video.id);
            this.mainWindow.webContents.send('onDownloadProgress', data);
        };



        const readStream = ytdl(item.video.id, ytdlOptions)
            .pipe(fs.createWriteStream(item.OUTPUT + '.crdownload'))
            .once('response', onceDownloadResponse.bind(this))
            .on('progress', onDownloadProgress.bind(this))
            .on('error', onError.bind(this));


        /// Convert (fluent-ffmpeg)

        // Convert events

        const onConvertEnd = () => {
            this.log(`[CONVERT_END] => video: ${item.video.id}`);
            end(EndType.SUCCESS);
        };

        let ffmpegCmd: any;
        if (item.type === 'VIDEO') {
            ffmpegCmd = this.convertToMp4(item);

        } else if (item.type === 'AUDIO') {
            ffmpegCmd = this.convertToMp3(item);
        }

        ffmpegCmd
            .on('error', onError.bind(this))
            .on('end', onConvertEnd.bind(this));


        ipcMain.on('cancelDownload.' + item.video.id, (evt, arg) => {
            cancel();
            end(EndType.CANCEL);
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













    download(event: any, arg: any) {
        this.createStream2(event, arg.video, arg.savePath);
    }




    createStream2(event: any, video: any, savePath: string) {

        let startDL;
        const fileName = this.sanitize(video.title, '');
        const OUTPUT = path.resolve(savePath, fileName + '.mp3');

        this.log('createStream');

        // On cancel download
        const cancel = (vid: any) => {
            this.log(`cancel => ${video.id}/${vid.id}`, vid.id);
            readStream.destroy(new Error(``));
            ffmpegCmd.kill();
            if (fs.existsSync(OUTPUT)) {
                fs.unlinkSync(OUTPUT);
            }
            this.mainWindow.webContents.send('onDownloadCancel', { id: video.id });
        };

        // On cancel download with error
        const cancelError = (vid: any, err: any) => {
            this.error(`cancel error => ${video.id}/${vid.id}`, vid.id);
            readStream.destroy(new Error(``));
            ffmpegCmd.kill();
            if (fs.existsSync(OUTPUT)) {
                fs.unlinkSync(OUTPUT);
            }
            this.mainWindow.webContents.send('onDownloadError', { id: video.id, error: err });
        };

        // Launch readstream
        const readStream = ytdl(video.id, { quality: 'highestaudio' })
        .once('response', (response) => {
            this.log(`ytdl => START => video: ${video.id}`);
            startDL = Date.now();
            this.mainWindow.webContents.send('onDownloadStart', { id: video.id });
        })
        .on('progress', (chunkLength, downloaded, total) => {
            const data = this.computeProgress(downloaded, total, startDL, video.id);
            // this.log(`[DOWNLOAD] ${video.id} ytdl => PROGRESS`, data.progress.percent);
            this.mainWindow.webContents.send('onDownloadProgress', data);
        })
        .on('error', (err) => {
            this.error(`ytdl => error => video: ${video.id}`, err);
            cancelError(video, err);
        })
        .on('end', () => {
            this.log(`ytdl => END => video: ${video.id}`);
        })
        .on('close', () => {
            this.log(`ytdl => CLOSE => video: ${video.id}`);
        })
        .on('finish', () => {
            this.log(`ytdl => FINISH => video: ${video.id}`);
        });

        // Convert stream to mp3
        const ffmpegCmd = ffmpeg(readStream)
            .audioBitrate(192)
            .audioCodec('libmp3lame')
            .toFormat('mp3')
            .save(OUTPUT)
            .on('error', (err) => {
                this.log(`ffmpeg => ERROR => video: ${video.id}`, err);
                cancelError(video, err);
            })
            .on('end', () => {
                this.log(`ffmpeg => END => video: ${video.id}`);
                this.mainWindow.webContents.send('onDownloadEnd', { id: video.id });
            });

        ipcMain.on('cancelDownload.' + video.id, (evt, arg) => {
            cancel(video);
        });

    }

    private computeProgress(downloaded: number, total: number, startDL: number, id: string) {
        const floatDownloaded = downloaded / total;
        const downloadedMinutes = (Date.now() - startDL) / 1000 / 60;
        return {
            id: id,
            progress: {
                percent: (floatDownloaded * 100).toFixed(2),
                downloaded: (downloaded / 1024 / 1024).toFixed(2),
                total: (total / 1024 / 1024).toFixed(2),
                mn: downloadedMinutes.toFixed(2),
                mnRest: (downloadedMinutes / floatDownloaded - downloadedMinutes).toFixed(2)
            }
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










/*
// ----------------------------------------------------------------------------
// Download management

export const streamList = {};

export function initDownload(isDev) {

    console.log('==============================================');
    console.log('initDownload');

    setFfmpegPath(isDev);

    ipcMain.on('download', (event, arg) => {
        console.log('=================');
        console.log('==> onDownload');

        if (!checkDownloadParam(arg, event)) {
            return;
        }

        createStream(event, arg.video, arg.savePath);
    });
}

function setFfmpegPath(isDev) {
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

    console.log('ffmpegPath', ffmpegPath);

    ffmpeg.setFfmpegPath(ffmpegPath);
}


function createStream(event, video, savePath) {

    let startDL;
    const fileName = sanitize(video.title, '');
    const OUTPUT = path.resolve(savePath, fileName + '.mp3');

    console.log('==> createStream => ytdl');

    const readStream = ytdl(video.id, { quality: 'highestaudio' })
    .once('response', (response) => {
        console.log(`[DOWNLOAD] ${video.id} => START`);
        startDL = Date.now();
        event.sender.send('onDownloadStart', { id: video.id });
    })
    .on('progress', (chunkLength, downloaded, total) => {
        const data = computeProgress(downloaded, total, startDL, video.id);
        // console.log(`[DOWNLOAD] ${video.id} ytdl => PROGRESS`, data.progress.percent);
        event.sender.send('onDownloadProgress', data);
    })
    .on('error', (err) => {
        console.log(`[DOWNLOAD] ${video.id} => ERROR => `, err);
        cancelError(event, video, err);
    })
    .on('end', () => {
        console.log(`[DOWNLOAD] ${video.id} => END`);
    })
    .on('close', () => {
        console.log(`[DOWNLOAD] ${video.id} => CLOSE`);
    })
    .on('finish', () => {
        console.log(`[DOWNLOAD] ${video.id} => FINISH`);
    });

    console.log('==> createStream => ffmpeg');

    const ffmpegCmd = ffmpeg(readStream)
        .audioBitrate(192)
        .audioCodec('libmp3lame')
        .toFormat('mp3')
        .save(OUTPUT)
        .on('error', (err) => {
            console.log(`[CONVERT] ${video.id} => ERROR`, err);
            cancelError(event, video, err);
        })
        .on('end', () => {
            console.log(`[CONVERT] ${video.id} END`);
            event.sender.send('onDownloadEnd', { id: video.id });
        });

    ipcMain.on('cancelDownload.' + video.id, (evt, arg) => {
        cancel(evt, video);
    });

    const cancel2 = (ev, vid) => {
        console.log(`[CANCEL] => ${video.id}/${vid.id}`, vid.id);
        readStream.destroy(new Error(``));
        ffmpegCmd.kill();
        if (fs.existsSync(OUTPUT)) {
            fs.unlinkSync(OUTPUT);
        }
        ev.sender.send('onDownloadCancel', { id: video.id });
    };

    const cancelError = (ev, vid, err) => {
        console.log(`[CANCEL_ERROR] => ${video.id}/${vid.id}`, vid.id);
        readStream.destroy(new Error(``));
        ffmpegCmd.kill();
        if (fs.existsSync(OUTPUT)) {
            fs.unlinkSync(OUTPUT);
        }
        event.sender.send('onDownloadError', { id: video.id, error: err });
    };
}

function computeProgress(downloaded, total, startDL, id) {
    const floatDownloaded = downloaded / total;
    const downloadedMinutes = (Date.now() - startDL) / 1000 / 60;
    return {
        id: id,
        progress: {
            percent: (floatDownloaded * 100).toFixed(2),
            downloaded: (downloaded / 1024 / 1024).toFixed(2),
            total: (total / 1024 / 1024).toFixed(2),
            mn: downloadedMinutes.toFixed(2),
            mnRest: (downloadedMinutes / floatDownloaded - downloadedMinutes).toFixed(2)
        }
    };
}

function checkDownloadParam(arg, event) {
    console.log('[DOWNLOAD] ==> check params', arg);
    if (!arg.savePath) {
        handleError('[DOWNLOAD] Error, missing savePath', event.sender);
        return false;
    }
    if (!arg.video) {
        handleError('[DOWNLOAD] Error, missing video', event.sender);
        return false;
    }
    console.log('[DOWNLOAD] ==> check params done!');
    return true;
}

// Sanitize string
function sanitize(input, replacement) {
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
*/
