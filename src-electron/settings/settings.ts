

import { app, BrowserWindow, ipcMain, ipcRenderer, Menu, shell, dialog, session } from 'electron';
import url = require('url');
import path = require('path');

export function openSettings() {

    let settingsWin = new BrowserWindow({
        width: 800,
        height: 600,
        minimizable: false,
        fullscreenable: false,
        resizable: false,
    });

    settingsWin.loadURL(url.format({
        pathname: path.join(__dirname, 'settings.html'),
        protocol: 'file:',
        slashes: true,
    }));

    settingsWin.webContents.on('did-finish-load', () => {
        settingsWin.show();
        settingsWin.focus();
    });

    settingsWin.on('closed', function () {
        settingsWin = null;
    });
}
