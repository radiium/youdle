
import { ipcMain, app, dialog } from 'electron';
import storage = require('electron-json-storage');
import { handleError } from './error';

export function initStorage() {

    console.log('==============================================');
    console.log('initStorage');
    console.log('Data path:', storage.getDataPath());

    // ----------------------------------------------------------------------------
    // App state management
    ipcMain.on('saveAppState', (event, data) => {
        storage.set('app-state', data, (error) => {
            handleError(error, event.sender, data);
        });
    });


    ipcMain.on('getAppState', (event, arg) => {
        storage.get('app-state', (error, data) => {
            handleError(error, event.sender, data);
            event.sender.send('getAppStateResp', data);
        });
    });

    // ----------------------------------------------------------------------------
    // App settings management
    ipcMain.on('saveSettings', (event, data) => {
        storage.set('settings', data, (error) => {
            handleError(error, event.sender, data);
        });
    });

    ipcMain.on('getSettings', (event, arg) => {
        storage.get('settings', (error, data) => {
            handleError(error, event.sender, data);
            if (!data.savePath) {
                data.savePath = app.getPath('downloads') || '';
            }
            if (!data.concurrentDownload) {
                data.concurrentDownload = 4;
            }
            event.sender.send('getSettingsResp', data);
        });
    });

    // ----------------------------------------------------------------------------
    // Get os type management
    ipcMain.on('getOsType', (event, data) => {
        event.sender.send('getOsTypeResp', process.platform);
    });

    // ----------------------------------------------------------------------------
    // Save path management

    /*
    ipcMain.on('getSavePathDefault', (event) => {
        const savePathDefault = app.getPath('downloads') || '';
        event.sender.send('getSavePathDefaultResp', savePathDefault);
    });
    */

    ipcMain.on('editSavePath', (event, arg) => {

        const savePath = arg.savePath;
        const savePathDefault = app.getPath('downloads') || '';

        dialog.showOpenDialog({
            title: 'Select folder',
            defaultPath: savePath || savePathDefault,
            properties: ['openDirectory', 'createDirectory']
        },
        (selFilePath) => {

            let selectedPath = selFilePath[0];
            if (!selectedPath) {
                selectedPath = savePathDefault;
            }
            console.log('editSavePath', selectedPath);
            event.sender.send('editSavePathResp', selectedPath);
        });
    });
}
