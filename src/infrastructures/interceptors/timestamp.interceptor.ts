/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';
import moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TimestampInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		return next
			.handle()
			.pipe(map((data) => this.convertDatesToTimestamps(data)));
	}

	private convertDatesToTimestamps(data: any): any {
		if (Array.isArray(data)) {
			return data.map((item) => this.convertDatesToTimestamps(item));
		} else if (data && typeof data === 'object') {
			for (const key of Object.keys(data)) {
				if (this.isValidDate(data[key])) {
					data[key] = moment(data[key]).valueOf(); // Convert to timestamp
				} else if (typeof data[key] === 'object') {
					data[key] = this.convertDatesToTimestamps(data[key]); // Recursively process objects
				}
			}
		}
		return data;
	}

	private isValidDate(value: any): boolean {
		return (
			value instanceof Date ||
			(typeof value === 'string' &&
				moment(value, moment.ISO_8601, true).isValid()) // Strict ISO 8601 check
		);
	}
}
