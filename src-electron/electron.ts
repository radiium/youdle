// Setup default environment

require('events').EventEmitter.prototype._maxListeners = 0;

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
console.log(`Electron launching with NODE_ENV: ${process.env.NODE_ENV}`);


// Import dependencies
import { app, BrowserWindow, ipcMain, Menu, dialog, clipboard } from 'electron';
import contextMenu = require('electron-context-menu');
import { initStorage } from './scripts/storage';
import { initDownloadEvent } from './scripts/download';

import url = require('url');
import path = require('path');


import { devMenuTemplate } from './menu/dev_menu.template';
import { fileMenuTemplate } from './menu/file_menu.template';
import { editMenuTemplate } from './menu/edit_menu.template';


// Init variable
let mainWindow: any = null;
const menus: any[] = [];
const isDev = process.env.NODE_ENV === 'development' ? true : false;


// Init context menu
if (isDev) {
    contextMenu({
        prepend: (params, browserWindow) => []
    });
}

// Create main window
const createMainWindow = async () => {

    // Initialize main window
    mainWindow = new BrowserWindow({
        width: 500,
        height: 325,
        minWidth: 500,
        minHeight: 300, // 196, // 174, // 125,
        // transparent: true,
        // frame: false,
        // titleBarStyle: 'hiddenInset', // 'customButtonsOnHover',
        // thickFrame: false,
        // backgroundColor: '#3D444C',
        darkTheme: true,
        // vibrancy: 'dark',
        webPreferences: {
            nodeIntegration: true,
            // contextIsolation: true,
            // experimentalFeatures: true // For prevent angular/animation error
        }
    });

    // DEV mode => Load app with live reload
    if (isDev) {
        require('electron-reload')(__dirname, {
            electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
            hardResetMethod: 'exit'
        });
        mainWindow.loadURL('http://localhost:4200');
        mainWindow.webContents.openDevTools();

    // PROD mode => Load app
    } else {
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true,
        }));
    }

    mainWindow.on('closed', () => mainWindow = null);
    mainWindow.once('ready-to-show', () => mainWindow.show());


    // Build menus
    menus.push(fileMenuTemplate);
    menus.push(editMenuTemplate);
    if (isDev) {
        menus.push(devMenuTemplate);
    }
    Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
    // console.log('Data path:', storage.getDataPath());
};



// On app is ready
app.on('ready', () => {
    createMainWindow();

    const width = mainWindow.getSize()[0];
    const height = (process.platform === 'darwin') ? 125 : 100;
    mainWindow.setSize(width, height);
    // mainWindow.setMinSize(width, height);
    // mainWindow.setMaxSize(width, height);
});

// On close app event
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Recreate window when icon is clicked
app.on('activate', () => {
    if (mainWindow === null) {
        createMainWindow();
    }
});

// Clear cahe and cookie session before quit
app.on('before-quit', () => {
    if (process.env.NODE_ENV !== 'development') {
        mainWindow.webContents.session.clearStorageData();
    }
});

app.on('browser-window-focus', (event, focusedWindow) => {
    // console.log('browser-window-focus');
    // console.log('clipboard', clipboard.readText());
    event.sender.send('sendClipboardValue', clipboard.readText());
});

initStorage();
initDownloadEvent();


export function errorHandler(error) {
    const msg: any = {
        type : 'error',
        title : 'Uncaught Exception',
        buttons: ['ok', 'close'],
        width : 400
    };

    switch (typeof error) {
        case 'object':
            msg.title = 'Uncaught Exception: ' + error.code;
            msg.message = error.message;
            break;
        case 'string':
            msg.message = error;
            break;
    }

    msg.detail = 'Please check the console log for more details.';
    mainWindow.send('onElectronError', msg);
}
process.on('uncaughtException', errorHandler);
