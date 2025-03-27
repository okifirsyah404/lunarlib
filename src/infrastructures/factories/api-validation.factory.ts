import { BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';

/**
 * Custom validation exception factory.
 *
 * This function will catch all validation errors and throw BadRequestException with the first error message
 *
 * @param errors
 */
export function apiValidationExceptionFactory(errors: ValidationError[]): void {
	errors.forEach((error) => {
		throw new BadRequestException(
			`${error.constraints?.[Object.keys(error.constraints)[0]]}`,
		);
	});
}
