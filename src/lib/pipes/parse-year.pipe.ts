import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseYearPipe implements PipeTransform {
    constructor(private propertyName: string, private minYear: number) { }

    async transform(value: any, metadata: ArgumentMetadata) {
        const numeric = Number(value);

        if (!numeric) {
            throw new BadRequestException(`${this.propertyName} is required`)
        }

        if (numeric < this.minYear) {
            throw new BadRequestException(`${this.propertyName} must be greater than or equal to ${this.minYear}`)
        }

        const maxYear = (new Date()).getUTCFullYear();

        if (numeric > maxYear) {
            throw new BadRequestException(`${this.propertyName} must be less than or equal to ${maxYear}`)
        }

        return numeric;
    }
}