import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ImageFileValidationPipe implements PipeTransform {
	// Allowed MIME types for images
	private readonly allowedMimeTypes = [
		'image/jpeg',
		'image/png',
		'image/gif',
		'image/webp',
	];

	// Maximum file size in bytes (10 MB)
	private readonly maxFileSize = 10 * 1024 * 1024;

	transform(file: Express.Multer.File | undefined): Express.Multer.File {
		if (!file) {
			throw new BadRequestException('File gambar tidak ditemukan');
		}

		// Validate MIME type
		if (!this.allowedMimeTypes.includes(file.mimetype)) {
			throw new BadRequestException(
				'File gambar tidak valid. Hanya mendukung JPEG, PNG, GIF, dan WEBP.',
			);
		}

		// Validate file size
		if (file.size > this.maxFileSize) {
			throw new BadRequestException(
				'Ukuran file gambar terlalu besar. Maksimal 10 MB.',
			);
		}

		return file; // If valid, return the file for further processing
	}
}
