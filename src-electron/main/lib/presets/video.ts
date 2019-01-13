export default (ffmpeg: any) => {
  ffmpeg
    .videoCodec('libx264')
    .videoBitrate('512k')
    .audioBitrate(192)
    .audioCodec('libmp3lame')
    .toFormat('mp4');
};
