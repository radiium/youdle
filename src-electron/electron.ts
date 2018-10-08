// Setup default environment

require('events').EventEmitter.prototype._maxListeners = 0;

// Import dependencies
import { app, BrowserWindow, Menu } from 'electron';
import * as contextMenu from 'electron-context-menu';
import { initStorage } from './scripts/storage';
import { initDownload } from './scripts/download';

import * as path from 'path';
import * as url from 'url';
import * as log from 'electron-log';

import { devMenuTemplate } from './menu/dev_menu.template';
import { fileMenuTemplate } from './menu/file_menu.template';
import { editMenuTemplate } from './menu/edit_menu.template';


// Init variable
let mainWindow: any = null;
const menus: any[] = [];

const args = process.argv.slice(1);
const isDev = args.some(val => val === '--dev');
log.info('COUCOU');
console.log('isDev', isDev);
console.log('Electron launching mode :', isDev ? 'development' : 'production');


// Init context menu
if (isDev) {
    contextMenu({
        prepend: (params, browserWindow) => [{
            label: 'Rainbow'
        }]
    });
}


// Create main window
const createMainWindow = async () => {

    // Initialize main window
    mainWindow = new BrowserWindow({
        width: 500,
        height: 325,
        minWidth: 500,
        minHeight: 300,
        darkTheme: true,
        backgroundColor: '#3b8d99',
        webPreferences: {
            nodeIntegration: true,
        }
    });

    // Entry point
    if (isDev) {
        require('electron-reload')(__dirname, {
            electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
            hardResetMethod: 'exit'
        });
        mainWindow.loadURL('http://localhost:4200');
    } else {
        mainWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true,
        }));
    }

    mainWindow.on('closed', () => mainWindow = null);
    mainWindow.once('ready-to-show', () => mainWindow.show());

    // Dev tools
    mainWindow.webContents.openDevTools();
    menus.push(devMenuTemplate);

    // Build menus
    menus.push(fileMenuTemplate);
    menus.push(editMenuTemplate);
    Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// On app is ready
app.on('ready', () => createMainWindow() );

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
    if (!isDev) {
        mainWindow.webContents.session.clearStorageData();
    }
});

initStorage();
initDownload(isDev);

process.on('uncaughtException', (error: any) => {
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
    if (mainWindow) {
        mainWindow.send('onElectronError', msg);
    }
    console.log('ELECTRON UNCAUGHT ERROR', msg);
});
