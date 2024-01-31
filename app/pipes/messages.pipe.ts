import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: 'parseMessage'
})
export class ParseMessagePipe implements PipeTransform {
  transform(
    value: string
  ) {
    if(value){
      return value.replace(/(?:\*)(?:(?!\s))((?:(?!\*|\n).)+)(?:\*)/g,'<b>$1</b>')
        .replace(/(?:_)(?:(?!\s))((?:(?!\n|_).)+)(?:_)/g,'<i>$1</i>')
        .replace(/(?:~)(?:(?!\s))((?:(?!\n|~).)+)(?:~)/g,'<s>$1</s>')
        .replace(/(?:--)(?:(?!\s))((?:(?!\n|--).)+)(?:--)/g,'<u>$1</u>')
        .replace(/(?:```)(?:(?!\s))((?:(?!\n|```).)+)(?:```)/g,'<tt>$1</tt>');
    }else{
      return value;
    }
  }
}
