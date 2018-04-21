// Filter pipe for real-time search
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})

export class FilterPipe implements PipeTransform {

transform(items: any[], searchText: string, searchPriority: string): any[] {
    if(!items) return [];
    if(!searchText) return items;

searchText = searchText.toLowerCase();
let LCTitle: string;

return items.filter(item => {
    LCTitle = item.title.toLowerCase();
        if (LCTitle.indexOf(searchText) !== -1 && searchPriority.indexOf(item.priority) !== -1)
            return true;
        else
            return false;
});
}

}
