import { YoutubeVideo } from 'shared/models/youtube-video';
import { SelectionModel } from '@angular/cdk/collections';

export interface AppList {
    list: YoutubeVideo[];
    selection: SelectionModel<YoutubeVideo>;
}
