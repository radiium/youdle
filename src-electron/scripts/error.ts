
export function handleError(error, sender, data?) {
    if (error) {
        const errorResp = {
            error: error,
            customData: data
        };
        sender.send('onElectronError', errorResp);
        throw error;
    }
}
