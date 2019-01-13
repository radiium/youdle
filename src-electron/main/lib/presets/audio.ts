export default (ffmpeg: any) => {
    ffmpeg
        .audioBitrate(192)
        .audioCodec('libmp3lame')
        .toFormat('mp3');
};
