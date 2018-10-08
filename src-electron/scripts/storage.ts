
import { ipcMain, app, dialog } from 'electron';
import { handleError } from './error';
import * as storage from 'electron-json-storage';



export function initStorage() {

    console.log('==============================================');
    console.log('initStorage (storage path: ' + storage.getDataPath() + ')');

    // ----------------------------------------------------------------------------
    // SavePath management
    ipcMain.on('getSavePath', (event) => {
        storage.get('savePath', (error, data) => {
            if (error || !data) {
                data = app.getPath('downloads') || '';
            }
            event.sender.send('getSavePathResp', data);
        });
    });

    ipcMain.on('setSavePath', (event, data) => {
        storage.set('savePath', data, (error) => {
            event.sender.send('getSavePathResp', data);
        });
    });

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
            storage.set('savePath', selectedPath, (error) => {
                event.sender.send('getSavePathResp', selectedPath);
            });
        });
    });

    // ----------------------------------------------------------------------------
    // ConcurrentDownload management
    ipcMain.on('getConcurrentDownload', (event) => {
        storage.get('concurrentDownload', (error, data) => {
            if (error || !data) {
                data = 3;
            }
            event.sender.send('getConcurrentDownloadResp', data);
        });
    });

    ipcMain.on('setConcurrentDownload', (event, data) => {
        storage.set('concurrentDownload', data, (error) => {
            event.sender.send('getConcurrentDownloadResp', data);
        });
    });
}
