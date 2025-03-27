import { IUserEntity } from '@contract/entities/users/user.entity.interface';
import { RoleEnum } from '@contract/enums/role.enum';
import {
	ApiResponse,
	ApiResponsePagination,
	IApiResponse,
	IApiResponsePagination,
} from '@contract/responses/api.response';
import { IPostResponse } from '@contract/responses/post.response.interface';
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import { GetUserLogged } from 'src/infrastructures/decorators/get-user-logged.decorator';
import { Roles } from 'src/infrastructures/decorators/role.decorator';
import { AccessTokenGuard } from 'src/infrastructures/guards/access-token.guard';
import { RoleGuard } from 'src/infrastructures/guards/role.guard';
import { ImageFileValidationPipe } from 'src/infrastructures/pipes/image-file.validation.pipe';
import { PostPaginationQuery } from '../dto/queries/post-pagination.query';
import {
	CreatePostRequest,
	UpdatePostRequest,
} from '../dto/requests/post.request';
import { PostService } from '../services/post.service';

@UseGuards(AccessTokenGuard)
@Controller('posts')
export class PostController {
	constructor(private readonly service: PostService) {}

	@Get()
	async paginatePosts(
		@Query() reqQuery: PostPaginationQuery,
	): Promise<IApiResponsePagination<IPostResponse>> {
		const result = await this.service.paginatePosts(reqQuery);

		return ApiResponsePagination.success({
			message: 'Retrieve posts successfully',
			pagination: result.pagination,
			data: result.items,
		});
	}

	@Get(':postId')
	async getPostById(
		@Param('postId') postId: string,
	): Promise<IApiResponse<IPostResponse>> {
		const result = await this.service.getPostById(postId);

		return ApiResponse.success({
			message: 'Retrieve post successfully',
			data: result,
		});
	}

	@UseGuards(RoleGuard)
	@Roles(RoleEnum.ADMIN, RoleEnum.MEMBER)
	@Post()
	async createPost(
		@GetUserLogged() user: IUserEntity,
		@Body() reqBody: CreatePostRequest,
	): Promise<IApiResponse<IPostResponse>> {
		const result = await this.service.createPost(user.id!, reqBody);

		return ApiResponse.success({
			message: 'Create post successfully',
			data: result,
		});
	}

	@UseGuards(RoleGuard)
	@Roles(RoleEnum.ADMIN, RoleEnum.MEMBER)
	@UseInterceptors(
		FileInterceptor('image', {
			storage: diskStorage({
				destination: path.join(process.cwd(), 'temp', 'uploads'),
				filename: (req, file, cb) => {
					const filename = `${+Date.now()}${path.extname(file.originalname)}`;
					cb(null, filename);
				},
			}),
		}),
	)
	@Post(':postId/uploads')
	async uploadPostImage(
		@GetUserLogged() user: IUserEntity,
		@Param('postId') postId: string,
		@UploadedFile(new ImageFileValidationPipe()) file: Express.Multer.File,
	): Promise<IApiResponse<IPostResponse>> {
		const result = await this.service.uploadPostImage(postId, user.id!, file);

		return ApiResponse.success({
			message: 'Upload post image successfully',
			data: result,
		});
	}

	@UseGuards(RoleGuard)
	@Roles(RoleEnum.ADMIN, RoleEnum.MEMBER)
	@Put(':postId')
	async updatePost(
		@GetUserLogged() user: IUserEntity,
		@Param('postId') postId: string,
		@Body() reqBody: UpdatePostRequest,
	): Promise<IApiResponse<IPostResponse>> {
		const result = await this.service.updatePost(postId, user.id!, reqBody);

		return ApiResponse.success({
			message: 'Update post successfully',
			data: result,
		});
	}

	@UseGuards(RoleGuard)
	@Roles(RoleEnum.ADMIN, RoleEnum.MEMBER)
	@Delete(':postId')
	async deletePost(
		@GetUserLogged() user: IUserEntity,
		@Param('postId') postId: string,
	): Promise<IApiResponse<undefined>> {
		await this.service.deletePost(postId, user.id!);

		return ApiResponse.success({
			message: 'Delete post successfully',
			data: undefined,
		});
	}
}
