const packageJson = require('../../package.json');
const creds = require('./creds.json') || {};

export const commonEnv = {
    appName: 'Youdle',
    versions: {
        app: packageJson.version,
        ytdlCore: packageJson.dependencies['ytdl-core'],
        fluentFfmpeg: packageJson.dependencies['fluent-ffmpeg'],
        angular: packageJson.devDependencies['@angular/core'],
        material: packageJson.devDependencies['@angular/material'],
        angularCli: packageJson.devDependencies['@angular/cli'],
        typescript: packageJson.devDependencies['typescript'],
      },
      publicKey: creds.publicKey
};
