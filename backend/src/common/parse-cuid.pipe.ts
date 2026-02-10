import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseCuidPipe implements PipeTransform {
  transform(value: string): string {
    if (!/^c[a-z0-9]{20,}$/.test(value)) {
      throw new BadRequestException('Invalid ID format');
    }
    return value;
  }
}
