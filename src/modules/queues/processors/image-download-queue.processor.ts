import { HttpService } from '@nestjs/axios';
import {
	OnQueueCompleted,
	OnQueueError,
	Process,
	Processor,
} from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import fs from 'fs';
import * as process from 'node:process';
import path from 'path';
import { QueueKeyConstant } from 'src/constants/keys/queue-key.constant';
import { IImageDownload } from 'src/contracts/files/image-download.interface';

@Processor(QueueKeyConstant.IMAGE_DOWNLOAD_QUEUE_PROCESSOR)
export class ImageDownloadQueueProcessor {
	constructor(private readonly httpService: HttpService) {}

	private readonly logger = new Logger(ImageDownloadQueueProcessor.name);

	private readonly downloadPath = path.join(process.cwd(), 'temp', 'downloads');

	@Process(QueueKeyConstant.IMAGE_DOWNLOAD_QUEUE_PROCESS)
	async downloadImage(job: Job<IImageDownload>): Promise<string> {
		this.checkAndCreateDirectory();

		const downloadedPath = path.join(this.downloadPath, `${job.data.seed}.png`);

		const writer = fs.createWriteStream(downloadedPath, { flags: 'w' });

		const response = await this.httpService.axiosRef(job.data.url, {
			responseType: 'stream',
			method: 'GET',
		});

		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		response.data.pipe(writer);

		return new Promise((resolve, reject) => {
			writer.on('finish', () => {
				resolve(downloadedPath);
			});
			writer.on('error', (error) => {
				reject(error);
			});
		});
	}

	@OnQueueCompleted()
	onCompleted(job: Job): void {
		this.logger.log(`Job ${job.id} has been finished`);
	}

	@OnQueueError()
	onError(error: Error): void {
		this.logger.error(error.message);
	}

	private checkAndCreateDirectory(): void {
		if (!fs.existsSync(this.downloadPath)) {
			fs.mkdirSync(this.downloadPath, { recursive: true });
		}
	}
}
