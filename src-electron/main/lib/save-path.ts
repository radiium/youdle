
import { ipcMain, app, dialog, BrowserWindow, OpenDialogOptions } from 'electron';
import storage = require('electron-json-storage');
import Logger from './logger';

export default class SavePath extends Logger {

    mainWindow: BrowserWindow;
    defaultSavePath: string;

    constructor(win: BrowserWindow) {
        super();
        this.mainWindow = win;
        this.defaultSavePath = app.getPath('downloads');
        this.initListener();

        // const defaultDataPath = storage.getDefaultDataPath();
        const dataPath = storage.getDataPath();
        this.log('Init Storage. Data path => ' + dataPath);
    }

    public destroy() {
        this.removeListener();
    }

    private initListener() {
        ipcMain.on('get-default-save-path', this.getDefaultSavePath.bind(this));
        ipcMain.on('edit-save-path', this.editSavePath.bind(this));
    }

    private removeListener() {
        ipcMain.on('get-default-save-path', this.getDefaultSavePath);
        ipcMain.on('edit-save-path', this.editSavePath);
    }


    // Get default save path (~/download)
    private getDefaultSavePath(event: any) {
        this.log('getDefaultSavePath');
        this.mainWindow.webContents
            .send('get-default-save-path-resp', null, this.defaultSavePath);
    }

    // Edit save path
    private editSavePath(event: any, arg: any) {
        this.log('editSavePath', arg);

        const dialogOption: OpenDialogOptions = {
            title: 'Select folder',
            defaultPath: arg.savePath || this.defaultSavePath,
            properties: [
                'openDirectory',
                'createDirectory',
                'promptToCreate'
            ]
        };

        dialog.showOpenDialog(dialogOption, (selFilePath) => {
            console.log('TESTT => ', selFilePath[0]);
            this.mainWindow.webContents.send('edit-save-path-resp', null, selFilePath[0]);
        });
    }
}
