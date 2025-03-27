import { BookEntity } from '@database/entities/posts/book.entity';
import { PostEntity } from '@database/entities/posts/post.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './controllers/post.controller';
import { PostRepository } from './repositories/post.repository';
import { PostService } from './services/post.service';

@Module({
	imports: [TypeOrmModule.forFeature([PostEntity, BookEntity])],
	controllers: [PostController],
	providers: [PostService, PostRepository],
})
export class PostModule {}
