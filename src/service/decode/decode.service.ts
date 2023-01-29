import { Injectable } from '@angular/core';

@Injectable()
export class DecodeService {
  instant(code: number): string {
    switch (code) {
      case 1234:
        return 'Coordinator';
      case 3456:
        return 'Expert';
      case 9012:
        return 'RGM';
    }
  }
}
