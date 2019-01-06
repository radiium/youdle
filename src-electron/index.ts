
// Import dependencies
import { app, BrowserWindow, ipcMain, ipcRenderer, Menu, shell, dialog, session } from 'electron';

import Youdle from './main/youdle';


// Setup default environment
const args = process.argv.slice(1);
const isDev = args.some(val => val === '--dev');
process.env.NODE_ENV = isDev ? 'development' : 'production';
console.log('Electron launching mode :', process.env.NODE_ENV);

Youdle.startApp(app);
