
import { ipcMain, app, dialog } from 'electron';
import { handleError } from './error';

export function initStorage() {

    console.log('==============================================');
    console.log('initStorage');


    // ----------------------------------------------------------------------------
    // App settings management
    ipcMain.on('getSavePath', (event) => {
        const savePath = app.getPath('downloads') || '';
        event.sender.send('getSavePathResp', savePath);
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
            console.log('editSavePath', selectedPath);
            event.sender.send('getSavePathResp', selectedPath);
        });
    });
}
