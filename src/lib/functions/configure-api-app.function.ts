import { DocumentBuilder } from '@nestjs/swagger';
import { initOpenapi } from './init-openapi.function';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestApplicationContextOptions } from '@nestjs/common/interfaces/nest-application-context-options.interface';

export type TApiAppConfig = {
  project: string,
  appRoot: string,
  corsOptions?: CorsOptions,
  globalPrefix?: string,
  title?: string,
  version?: string,
  logger?: NestApplicationContextOptions['logger'],
  documentBuilder?: (documentBuilder: DocumentBuilder) => DocumentBuilder,
};

export async function configureApiApp(
  module: { name: string },
  options: TApiAppConfig
) {

  const {
    project,
    appRoot,
    corsOptions,
    globalPrefix,
    title,
    logger,
    version,
    documentBuilder,
  } = options;

  const app = await NestFactory.create(module, { logger });

  app.setGlobalPrefix(globalPrefix);
  app.enableCors(corsOptions);
  app.enableShutdownHooks();
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  await initOpenapi(app, title || module.name, project, appRoot, version, documentBuilder);

  return app;
}
