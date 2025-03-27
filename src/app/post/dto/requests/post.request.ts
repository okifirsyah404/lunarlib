import { ICreatePostRequest } from '@contract/requests/create-post.request.interface';
import { PartialType } from '@nestjs/mapped-types';
import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Max,
	Min,
} from 'class-validator';

export class CreatePostRequest implements ICreatePostRequest {
	@IsString()
	@IsNotEmpty()
	postContent: string;

	@IsInt()
	@Min(1000)
	@Max(100000000)
	@IsNotEmpty()
	postPrice: number;

	@IsString()
	@IsNotEmpty()
	bookTitle: string;

	@IsString()
	@IsNotEmpty()
	bookAuthor: string;

	@IsString()
	@IsOptional()
	bookISBN?: string;

	@IsString()
	@IsOptional()
	bookLanguage?: string;

	@IsString()
	@IsOptional()
	bookPublishYear?: string;

	@IsString()
	@IsOptional()
	bookPublisher?: string;
}

export class UpdatePostRequest extends PartialType(CreatePostRequest) {}
