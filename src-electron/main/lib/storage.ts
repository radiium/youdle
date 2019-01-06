
import { ipcMain, BrowserWindow } from 'electron';
import storage = require('electron-json-storage');
import Logger from './logger';

export default class Storage extends Logger {

    mainWindow: BrowserWindow;

    constructor(win: BrowserWindow) {
        super();
        this.mainWindow = win;
        this.initListener();

        // const defaultDataPath = storage.getDefaultDataPath();
        const dataPath = storage.getDataPath();
        this.log('Init Storage. Data path => ' + dataPath);
    }

    public destroy() {
        this.removeListener();
    }

    private initListener() {
        ipcMain.on('get-all-items', this.getAllItems.bind(this));
        ipcMain.on('delete-all-items', this.deleteAllItems.bind(this));
        ipcMain.on('get-item', this.getItem.bind(this));
        ipcMain.on('set-item', this.setItem.bind(this));
        ipcMain.on('has-item', this.hasItem.bind(this));
        ipcMain.on('delete-item', this.deleteItem.bind(this));
    }

    private removeListener() {
        ipcMain.removeListener('get-all-items', this.getAllItems);
        ipcMain.removeListener('delete-all-items', this.deleteAllItems);
        ipcMain.removeListener('get-item', this.getItem);
        ipcMain.removeListener('set-item', this.setItem);
        ipcMain.removeListener('has-item', this.hasItem);
        ipcMain.removeListener('delete-item', this.deleteItem);
    }

    // Get all stored datas
    private getAllItems(event) {
        this.log('getAllItems');
        storage.getAll({}, (error, data) => {
            this.mainWindow.webContents.send('get-all-items-resp', error, data);
        });
    }

    // Get data by key
    private deleteAllItems(event) {
        this.log('deleteAllItems');
        storage.clear((error) => {
            this.mainWindow.webContents.send('delete-all-items-resp', error);
        });
    }

    // Get data by key
    private getItem(event, key: string) {
        this.log('getItem', key);
        storage.get(key, (error, data) => {
            this.mainWindow.webContents.send('get-item-resp', error, data);
        });
    }

    // Set data by key
    private setItem(event, key: string, data: any) {
        this.log('setItem', key, data);
        storage.set(key, data, (error) => {
            this.mainWindow.webContents.send('set-item-resp', error);
        });
    }

    // Has data by key
    private hasItem(event, key: string) {
        this.log('hasItem', key);
        storage.has(key, (error, data) => {
            this.mainWindow.webContents.send('has-item-resp', error, data);
        });
    }

    // Delete data by key
    private deleteItem(event, key: string) {
        this.log('deleteItem', key);
        storage.remove(key, (error) => {
            this.mainWindow.webContents.send('delete-item-resp', error);
        });
    }
}
