import { Pipe, PipeTransform } from "@angular/core";
import { groupBy } from "lodash";

@Pipe({
  name: 'groupBy'
})
export class GroupByPipe implements PipeTransform {
  transform(
    value: any[], key: string, aggregation: 'sum' | 'count' | 'avg' = 'sum'
  ) {
    if (value) {
      return Object.entries( groupBy(value, key) );
    } else {
      return value;
    }
  }

}
