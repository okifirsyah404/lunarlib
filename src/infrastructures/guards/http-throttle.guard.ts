import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class HttpThrottleGuard extends ThrottlerGuard {
	protected errorMessage: string = 'Too many requests, please try again later.';
}
