import { BullModule } from '@nestjs/bull';
import { Global, Module } from '@nestjs/common';
import { QueueKeyConstant } from 'src/constants/keys/queue-key.constant';
import { ImageDownloadQueueProcessor } from './processors/image-download-queue.processor';
import { ImageDownloadQueueService } from './providers/image-download-queue.service';

@Global()
@Module({
	imports: [
		BullModule.registerQueue({
			name: QueueKeyConstant.IMAGE_DOWNLOAD_QUEUE_PROCESSOR,
			defaultJobOptions: {
				removeOnComplete: true,
				removeOnFail: true,
			},
		}),
	],
	providers: [ImageDownloadQueueProcessor, ImageDownloadQueueService],
	exports: [ImageDownloadQueueService],
})
export class QueuesModule {}
