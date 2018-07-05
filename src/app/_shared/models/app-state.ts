import { YoutubeVideo } from 'shared/models/youtube-video';

export interface AppState {
    loader: boolean;
    notFound: boolean;
    macOsTitleBar: boolean;
    inputValue: string;
    selectedTab: number;
    // downloadStarted: boolean;
    videoList: YoutubeVideo[];
}
