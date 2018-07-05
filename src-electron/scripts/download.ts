

import { app, BrowserWindow, ipcMain, Menu, dialog, clipboard } from 'electron';
import ytdl = require('ytdl-core');
import ffmpeg = require('fluent-ffmpeg');
import ffmpegStatic = require('ffmpeg-static');
import fs = require('fs-extra');
import url = require('url');
import path = require('path');

import { handleError } from './error';

console.log(ffmpegStatic.path);
console.log('temp', app.getPath('temp'));


// ----------------------------------------------------------------------------
// Download management



ipcMain.on('onDownload', (event, arg) => {
    console.log('==> onDownload =======================');
    console.log('params', arg);

    const index = arg.index;
    const videoId = arg.videoId;
    const filePath = arg.filePath;
    const fileName = arg.fileName;

    if (!checkDownloadParam(index, videoId, filePath, fileName, event)) {
        return;
    }

    download(event, index, videoId, fileName);

    // event.sender.send('downloadProgress');
    // event.sender.send('convertProgress');

});

function download(event, index, videoId, fileName) {

    console.log('==> download');

    let startDL;
    fileName = sanitize(fileName, '') + '.tmp_download';
    const TMP_OUT = path.resolve(app.getPath('desktop'), 'dll', fileName);
    // app.getPath('temp')

    console.log('fileName', fileName);
    console.log('TMP_OUT', TMP_OUT);

    const ytFile = ytdl(videoId, {
        quality: 'highestaudio',
        // filter: 'audioonly',
    });

    ytFile.pipe(fs.createWriteStream(TMP_OUT));

    ytFile.once('response', () => {
        console.log('start');
        startDL = Date.now();
        event.sender.send('downloadProgress', { type: 'download', status: 'start', index: index });
    });

    ytFile.on('progress', (chunkLength, downloaded, total) => {
        // console.log('DOWNLOAD => progress');
        const floatDownloaded = downloaded / total;
        const downloadedMinutes = (Date.now() - startDL) / 1000 / 60;

        const data = {
            type: 'download',
            status: 'progress',
            index: index,
            progress: {
                percent: (floatDownloaded * 100).toFixed(2),
                downloaded: (downloaded / 1024 / 1024).toFixed(2),
                total: (total / 1024 / 1024).toFixed(2),
                mn: downloadedMinutes.toFixed(2),
                mnRest: (downloadedMinutes / floatDownloaded - downloadedMinutes).toFixed(2)
            }
        };

        // console.log('progress', data);
        event.sender.send('downloadProgress', data);
    });

    ytFile.on('end', () => {
        console.log('ended');
        event.sender.send('downloadProgress', { type: 'download', status: 'ended', index: index });
    });
}



function checkDownloadParam(event, index, videoId, filePath, fileName) {

    console.log('==> check params');

    if (!videoId) {
        handleError('Error, wrong videoId: ' + videoId, event.sender);
    }
    if (!filePath) {
        handleError('Error, wrong filePath: ' + filePath, event.sender);
    }
    if (!fileName) {
        handleError('Error, wrong fileName: ' + fileName, event.sender);
    }
    if (!videoId || !fileName || !filePath) {
        return false;
    }

    console.log('==> check params done!');

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

