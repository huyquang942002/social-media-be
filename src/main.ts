import { addProfile } from '@automapper/core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as awsConfig from 'aws-sdk';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { authProfile } from './auth/auth.profile';
import { mapper } from './configuration/mapper';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { postProfile } from './posts/post.profile';
import * as fs from 'fs';
import * as https from 'https';
import { commentProfile } from './comment/comment.profile';

dotenv.config({ path: `${__dirname}/../.env` });

async function bootstrap() {
  // const certificate = fs.readFileSync(
  //   '/Users/nongquanghuy/Documents/Linux/social-media-be/src/conversation/cert.pem',
  //   'utf8',
  // );
  // const privateKey = fs.readFileSync(
  //   '/Users/nongquanghuy/Documents/Linux/social-media-be/src/conversation/private-key.pem',
  //   'utf8',
  // );

  // const httpsOptions = { key: privateKey, cert: certificate };

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(configureCors(app));

  configAutoMapper();
  configSwagger(app);
  awsS3Config(app);

  process.env.TZ = 'Etc/Universal'; // UTC +00:00

  await app.listen(process.env.APP_PORT || 3000, () => {
    console.log(`App listening in ${process.env.APP_PORT || 3000}`);
  });
}
bootstrap();

function configAutoMapper() {
  // addProfile(mapper, tagProfile);
  addProfile(mapper, authProfile);
  addProfile(mapper, postProfile);
  addProfile(mapper, commentProfile);
  // addProfile(mapper, nationProfile);
  // addProfile(mapper, categoryProfile);
  // addProfile(mapper, notificationProfile);
  // addProfile(mapper, appSettingProfile);
  // addProfile(mapper, interactProfile);
  // addProfile(mapper, groupProfile);
  // addProfile(mapper, groupUserProfile);
  // addProfile(mapper, groupCatgoriesProfile);
  // addProfile(mapper, publicApiProfile);
  // addProfile(mapper, groupRuleProfile);
  // addProfile(mapper, userProfile);
  // addProfile(mapper, draftThreadProfile);
  // addProfile(mapper, messagesProfile);
  // addProfile(mapper, userHistoryProfile);
  // addProfile(mapper, userReportProfile);
  // addProfile(mapper, cmsGroupProfile);
  // addProfile(mapper, cmsCategoryProfile);
  // addProfile(mapper, cmsTagProfile);
  // addProfile(mapper, cmsUserProfile);
  // addProfile(mapper, bannerProfile);
  // addProfile(mapper, roleProfile);
  // addProfile(mapper, cmsThreadProfile);
}

function awsS3Config(app: INestApplication) {
  const configService = app.get(ConfigService);
  awsConfig.config.update({
    accessKeyId: configService.get<string>('AWS_ACCESS_KEY_ID'),
    secretAccessKey: configService.get<string>('AWS_SECRET_ACCESS_KEY'),
    region: configService.get<string>('AWS_REGION'),
  });
}

function configSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Social Media API')
    .setDescription('Social Media APIs document')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}

function configureCors(app: INestApplication) {
  const configService = app.get(ConfigService);
  const origins = configService.get<string>('CORS_CONFIGURE').split(',');

  return {
    allowedHeaders: '*',
    origin: origins || [
      'https://localhost:3000',
      'http://localhost:5173/',
      'https://localhost:5173/',
      'http://127.0.0.1:5173/',
      'https://127.0.0.1:5173/',
    ],
  };
}
