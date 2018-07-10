import { YoutubeVideo } from 'shared/models/youtube-video';

export interface AppState {
    loader: boolean;
    notFound: boolean;
    inputValue: string;
    selectedTab: number;
}
