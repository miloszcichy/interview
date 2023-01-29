import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Content } from '../../model/content.model';

@Injectable()
export class ContentApi {
  content = [
    { id: 1, description: 'lorem ipsum', department: 1, location: 10},
    { id: 2, description: 'some text', department: 2, location: 11 },
    { id: 3, description: 'another description', department: 1, location: 11 },
  ] as Content[];

  getContent(): Observable<Content[]> {
    return of(this.content);
  }
}
