import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Content } from '../../model/content.model';

@Injectable()
export class ContentApi {
  private content = [
    {
      id: 1,
      description: 'Important information regarding...',
      department: 1,
      location: 10,
    },
    { id: 2, description: 'New office for...', department: 2, location: 11 },
    {
      id: 3,
      description: 'Stakeholders meeting at...',
      department: 1,
      location: 11,
    },
  ] as Content[];

  getContent(): Observable<Content[]> {
    return of(this.content);
  }
}
