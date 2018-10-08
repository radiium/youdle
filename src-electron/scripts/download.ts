

import { app, ipcMain } from 'electron';
import * as ytdl from 'ytdl-core';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

import { handleError } from './error';

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

    /* Useless...
    ipcMain.on('onCancelDownload', (event, arg) => {
        console.log('=================');
        console.log('==> onCancelDownload', streamList);

        for (const key in streamList) {
            if (streamList.hasOwnProperty(key)) {

                // streamList[key].convertStream.ffmpegProc.kill();
                streamList[key].readStream._destroy((err) => {
                    console.log('CLOSE readStream', err);
                });
            }
        }
    });
    */
}


function setFfmpegPath(isDev) {
    let ffmpegPath = '';
    const platform = os.platform();
    const arch = os.arch();
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

    const cancel = (ev, vid) => {
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
