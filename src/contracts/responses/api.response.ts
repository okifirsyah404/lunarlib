import moment from 'moment';

export interface IApiResponse<T> {
	message: string;
	timestamp: number;
	data: T;
}

export interface IPaginationQuery {
	page: number;
	limit: number;
}

export interface IPagination extends IPaginationQuery {
	totalPages: number;
	total: number;
}

export interface IPaginationResult<T> {
	pagination: IPagination;
	items: T[];
}

export interface IApiResponsePagination<T>
	extends Omit<IApiResponse<T>, 'data'> {
	pagination: IPagination;
	data: T[];
}

export class ApiResponse<T> implements IApiResponse<T> {
	constructor({ message, timestamp, data }: IApiResponse<T>) {
		this.timestamp = timestamp;
		this.message = message;
		this.data = data;
	}

	timestamp: number;
	message: string;
	data: T;

	static success<R>({
		message,
		data,
	}: Pick<IApiResponse<R>, 'message' | 'data'>): ApiResponse<R> {
		return new ApiResponse<R>({
			timestamp: moment().valueOf(),
			message: message,
			data,
		});
	}

	static exception({
		message,
	}: Pick<IApiResponse<undefined>, 'message'>): ApiResponse<undefined> {
		return new ApiResponse<undefined>({
			timestamp: moment().valueOf(),
			message: message,
			data: undefined,
		});
	}
}

export class ApiResponsePagination<T> implements IApiResponsePagination<T> {
	constructor({
		message,
		timestamp,
		data,
		pagination,
	}: IApiResponsePagination<T>) {
		this.message = message;
		this.timestamp = timestamp;
		this.pagination = pagination;
		this.data = data;
	}
	pagination: IPagination;

	message: string;
	timestamp: number;
	meta: IPagination;
	data: T[];

	static success<R>({
		message,
		data,
		pagination,
	}: Pick<
		IApiResponsePagination<R>,
		'message' | 'data' | 'pagination'
	>): ApiResponsePagination<R> {
		return new ApiResponsePagination<R>({
			timestamp: moment().valueOf(),
			message: message,
			pagination,
			data,
		});
	}
}
