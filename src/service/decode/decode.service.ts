import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable()
export class DecodeService {
  instant(code: number): Observable<string> {
    let result;
    switch (code) {
      case 1:
        result = of('Java');
        break;
      case 2:
        result = of('.NET');
        break;
      case 10:
        result =  of('Berlin');
        break;
      case 11:
        result =  of('Paris');
        break;
    }
    return result;
  }
}
