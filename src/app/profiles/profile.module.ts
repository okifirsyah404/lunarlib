import { UserEntity } from '@database/entities/users/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './controllers/profile.controller';
import { ProfileRepository } from './repositories/profile.repository';
import { ProfileService } from './services/profile.service';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity])],
	controllers: [ProfileController],
	providers: [ProfileService, ProfileRepository],
})
export class ProfileModule {}
