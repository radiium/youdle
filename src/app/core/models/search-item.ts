import { Progress } from './progress';
import { ProgressStatus } from './progress-status';

export interface SearchItem {
    id?: string;
    thumb?: string;
    duration?: number;
    title?: string;
    publishedAt?: string;
    selected?: boolean;
    status: ProgressStatus;
    progress?: Progress;
}
