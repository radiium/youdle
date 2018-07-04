




function extractID(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    const match = url.match(regExp);
    let list = url.match('list=([a-zA-Z0-9\-\_]+)&?');
    list = list ? list[1] : '';

    if (match && match[7].length === 11) {
        console.log('extractID video', match[7]);
        return { type: 'video', id: match[7] };
    } else if (list !== '') {
        console.log('extractID playlist', list);
        return { type: 'playlist', id: list };
    } else {
        console.log('Could not extract video ID.');
        return null;
    }
}



extractID(process.argv[2]);