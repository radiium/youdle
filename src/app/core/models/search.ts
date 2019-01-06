import { SelectionModel } from '@angular/cdk/collections';
import { SearchItem } from './search-item';

export interface Search {
    inputValue: string;
    items: SearchItem[];
    selectedItems: SelectionModel<SearchItem>;
}
