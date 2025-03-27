import { ConsoleLogger, Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { apiValidationExceptionFactory } from './infrastructures/factories/api-validation.factory';
import HttpExceptionFilter from './infrastructures/filters/http-exception.fitler';
import { TimestampInterceptor } from './infrastructures/interceptors/timestamp.interceptor';
import { AppConfigService } from './modules/app-config/providers/app-config.service';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create(AppModule, {
		logger: new ConsoleLogger({
			json: true,
			colors: true,
		}),
	});

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			exceptionFactory: (errors): any => apiValidationExceptionFactory(errors),
		}),
	);

	app.useGlobalFilters(new HttpExceptionFilter());

	app.useGlobalInterceptors(new TimestampInterceptor());

	const config = app.get(AppConfigService).appConfig;

	await app.listen(config.appPort, config.appHost);

	new Logger('Api App Service').log(
		`Api App Service is running on: ${await app.getUrl()}`,
	);
}

void bootstrap();
