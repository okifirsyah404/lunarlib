import { ICreatePostRequest } from '@contract/requests/create-post.request.interface';
import { IPaginationResult } from '@contract/responses/api.response';
import { IPostResponse } from '@contract/responses/post.response.interface';
import {
	Injectable,
	Logger,
	NotFoundException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { FileUtil } from '@util/file.util';
import {
	ClearCache,
	RefreshCache,
	SetCache,
} from 'src/infrastructures/decorators/app-cache.decorator';
import { AppS3StorageService } from 'src/modules/s3storage/providers/app-s3storage.service';
import { PostPaginationQuery } from '../dto/queries/post-pagination.query';
import { PostRepository } from '../repositories/post.repository';

@Injectable()
export class PostService {
	constructor(
		private readonly repository: PostRepository,
		private readonly appS3Storage: AppS3StorageService,
	) {}

	private readonly logger = new Logger(PostService.name);

	async paginatePosts(
		reqQuery: PostPaginationQuery,
	): Promise<IPaginationResult<IPostResponse>> {
		const result = await this.repository.paginatePosts(reqQuery);

		return {
			pagination: result.pagination,
			items: await Promise.all(
				result.items.map(async (item) => {
					const formattedItems = await this.appS3Storage.getPostSignedUrl(item);

					if (formattedItems?.user?.profile) {
						formattedItems.user.profile =
							await this.appS3Storage.getProfileSignedUrl(
								formattedItems.user.profile,
							);
					}

					return formattedItems;
				}),
			),
		};
	}

	@SetCache<IPostResponse>((postId: string) => `post:${postId}`, {
		ttl: 60,
		unit: 'minutes',
	})
	async getPostById(postId: string): Promise<IPostResponse> {
		const post = await this.repository.getPostById(postId);

		if (!post) {
			throw new NotFoundException('Post not found');
		}

		const formattedPost = await this.appS3Storage.getPostSignedUrl(post);

		if (formattedPost?.user?.profile) {
			formattedPost.user.profile = await this.appS3Storage.getProfileSignedUrl(
				formattedPost.user.profile,
			);
		}

		return formattedPost;
	}

	async createPost(
		userId: string,
		reqBody: ICreatePostRequest,
	): Promise<IPostResponse> {
		const post = await this.repository.createPost(userId, reqBody);

		if (!post) {
			throw new UnprocessableEntityException('Post creation failed');
		}

		const formattedPost = await this.appS3Storage.getPostSignedUrl(post);

		if (formattedPost?.user?.profile) {
			formattedPost.user.profile = await this.appS3Storage.getProfileSignedUrl(
				formattedPost.user.profile,
			);
		}

		return formattedPost;
	}

	@RefreshCache<IPostResponse>((postId: string) => `post:${postId}`)
	async updatePost(
		postId: string,
		userId: string,
		reqBody: Partial<ICreatePostRequest>,
	): Promise<IPostResponse> {
		const post = await this.repository.getPostById(postId);

		if (!post) {
			throw new NotFoundException('Post not found');
		}

		if (post.userId !== userId) {
			throw new UnprocessableEntityException(
				'Unauthorized to update this post',
			);
		}

		const updatedPost = await this.repository.updatePost(postId, reqBody);

		if (!updatedPost) {
			throw new UnprocessableEntityException('Post update failed');
		}

		const formattedPost = await this.appS3Storage.getPostSignedUrl(updatedPost);

		if (formattedPost?.user?.profile) {
			formattedPost.user.profile = await this.appS3Storage.getProfileSignedUrl(
				formattedPost.user.profile,
			);
		}

		return formattedPost;
	}

	@RefreshCache<IPostResponse>((postId: string) => `post:${postId}`, {
		ttl: 60,
		unit: 'minutes',
	})
	async uploadPostImage(
		postId: string,
		userId: string,
		file: Express.Multer.File,
	): Promise<IPostResponse> {
		this.logger.log(`File directory: ${file.filename}`);

		const post = await this.repository.getPostById(postId);

		if (!post) {
			throw new NotFoundException('Post not found');
		}

		if (post.image) {
			await FileUtil.deleteTempFile(file.path);
			throw new UnprocessableEntityException('Post already has an image');
		}

		if (post.userId !== userId) {
			await FileUtil.deleteTempFile(file.path);
			throw new UnprocessableEntityException(
				'Unauthorized to update this post',
			);
		}

		const imageUrl = await this.appS3Storage.uploadFileFromPath({
			filePath: file.path,
			seed: `posts/${postId}`,
			deleteAfterUpload: true,
		});

		this.logger.log(`Image URL: ${imageUrl}`);

		if (!imageUrl) {
			throw new UnprocessableEntityException('Image upload failed');
		}

		const updatedPost = await this.repository.updatePostImage(postId, imageUrl);

		if (!updatedPost) {
			throw new UnprocessableEntityException('Post update failed');
		}

		this.logger.log(`Updated Post :${JSON.stringify(updatedPost)}`);

		const formattedPost = await this.appS3Storage.getPostSignedUrl(updatedPost);

		if (formattedPost?.user?.profile) {
			formattedPost.user.profile = await this.appS3Storage.getProfileSignedUrl(
				formattedPost.user.profile,
			);
		}

		return formattedPost;
	}

	@ClearCache((postId: string) => `post:${postId}`)
	async deletePost(postId: string, userId: string): Promise<void> {
		const post = await this.repository.getPostById(postId);

		if (!post) {
			throw new NotFoundException('Post not found');
		}

		if (post.userId !== userId) {
			throw new UnprocessableEntityException(
				'Unauthorized to delete this post',
			);
		}
	}
}
