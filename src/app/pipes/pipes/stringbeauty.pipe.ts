import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringbeauty'
})
export class StringbeautyPipe implements PipeTransform {

  transform(value: any): string {
    const data = value.split(',');
    let newStr: string = "";
    for (var i = data.length; i++;) {
      newStr += data[i].toUpperCase()+" ";
    }
    return newStr;
  }

}
