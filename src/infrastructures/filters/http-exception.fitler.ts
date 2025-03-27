import { IApiResponse } from '@contract/responses/api.response';
import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export default class HttpExceptionFilter implements ExceptionFilter {
	private readonly logger = new Logger(HttpExceptionFilter.name);

	catch(
		exception: HttpException,
		host: ArgumentsHost,
	): Response<any, Record<string, any>> | void {
		const context = host.switchToHttp();
		const response = context.getResponse<Response>();
		const status = exception.getStatus();

		this.logger.warn(exception.message);

		let baseResponse: IApiResponse<never>;

		const message =
			(exception.getResponse() as { message: string }).message ||
			exception.name;

		if (exception.message.includes('ENOENT')) {
			baseResponse = {
				timestamp: Date.now(),
				message: 'File not found',
			} as IApiResponse<never>;

			return response.status(404).send(baseResponse);
		}

		baseResponse = {
			timestamp: Date.now(),
			message: message,
		} as IApiResponse<never>;

		response.status(status).send(baseResponse);
	}
}
