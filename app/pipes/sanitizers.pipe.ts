
import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
  name: 'sanitizeHTML'
})
export class SanitizerPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(
    value: string,
    type: 'HTML' | 'URL' | 'STYLE' = 'HTML'
  ) {
    if(value){
      switch (type) {
        case 'STYLE':
          return this.sanitizer.bypassSecurityTrustStyle(value);
        case 'URL':
          return this.sanitizer.bypassSecurityTrustUrl(value);
        default: 
          return this.sanitizer.bypassSecurityTrustHtml(value);
      }
    }
    return value;
  }
}