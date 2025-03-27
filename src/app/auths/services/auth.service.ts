import { IJwtPayload } from '@contract/jwts/jwt-payload.interface';
import {
	IBasicAuthRequest,
	IRegisterAuthRequest,
} from '@contract/requests/auth.request.interface';
import { IAuthResponse } from '@contract/responses/auth.response.interface';
import {
	Injectable,
	Logger,
	NotFoundException,
	UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CryptoUtil } from '@util/crypto.util';
import { AppConfigService } from 'src/modules/app-config/providers/app-config.service';
import { ImageDownloadQueueService } from 'src/modules/queues/providers/image-download-queue.service';
import { AppS3StorageService } from 'src/modules/s3storage/providers/app-s3storage.service';
import { AccountRepository } from '../repositories/account.repository';

@Injectable()
export class AuthService {
	constructor(
		private readonly config: AppConfigService,
		private readonly accountRepository: AccountRepository,
		private readonly jwtService: JwtService,
		private readonly s3StorageService: AppS3StorageService,
		private readonly imageDownloadQueue: ImageDownloadQueueService,
	) {}

	private readonly logger = new Logger(AuthService.name);

	async basicSignIn({
		email,
		password,
	}: IBasicAuthRequest): Promise<IAuthResponse> {
		const account = await this.accountRepository.getAccountByEmail(email);

		if (!account) {
			throw new UnprocessableEntityException('Account not found');
		}

		const isPasswordValid = await CryptoUtil.compare(
			password,
			account?.password ?? '',
		);

		if (!isPasswordValid) {
			throw new NotFoundException('Wrong password');
		}

		const tokens = await this.generateAccessToken({
			sub: account?.user?.id ?? '',
			username: account?.user?.username ?? '',
			email: account.email,
		});

		return {
			accessToken: tokens,
		};
	}

	async register(reqData: IRegisterAuthRequest): Promise<IAuthResponse> {
		const existAccount =
			await this.accountRepository.getAccountByEmailOrUsername(
				reqData.email,
				reqData.username,
			);

		if (existAccount) {
			throw new NotFoundException('Account already exists');
		}

		const hashPassword = await CryptoUtil.hash(
			reqData.password,
			this.config.bcryptConfig.saltRounds,
		);

		this.logger.log('hash password', hashPassword);

		const account = await this.accountRepository.createAccount({
			email: reqData.email,
			password: hashPassword,
			username: reqData.username,
			name: reqData.name,
			bio: reqData.bio,
		});

		if (!account) {
			throw new NotFoundException('Account creation failed');
		}

		void this.imageDownloadQueue.downloadImage(
			{
				url: `https://api.dicebear.com/9.x/notionists-neutral/png?seed=${account.user?.username}?size=64`,
				seed: account?.user?.id ?? '',
			},
			async (result) => {
				if (account?.user?.id) {
					const res = await this.s3StorageService.uploadFileFromPath({
						seed: `users/${account?.user?.id}`,
						filePath: result,
						deleteAfterUpload: true,
					});

					if (account.user?.profileId) {
						await this.accountRepository.updateImageProfile(
							account.user.profileId,
							res,
						);
					}
				}
			},
		);

		const tokens = await this.generateAccessToken({
			sub: account?.user?.id ?? '',
			username: account?.user?.username ?? '',
			email: account.email,
		});

		return {
			accessToken: tokens,
		};
	}

	async generateAccessToken(payload: IJwtPayload): Promise<string> {
		return await this.jwtService.signAsync(payload);
	}

	async verifyAccessToken(token: string): Promise<IJwtPayload> {
		return await this.jwtService.verifyAsync(token, {
			secret: this.config.jwtConfig.accessTokenSecret,
		});
	}
}
