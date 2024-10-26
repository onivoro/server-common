import { DocumentBuilder } from '@nestjs/swagger';
import { initOpenapi } from './init-openapi.function';
import { NestFactory } from '@nestjs/core';
import * as bodyParser from 'body-parser';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { NestApplicationOptions } from '@nestjs/common';

export type TApiAppConfig = {
  project: string,
  appRoot: string,
  corsOptions?: CorsOptions,
  globalPrefix?: string,
  title?: string,
  version?: string,
  documentBuilder?: (documentBuilder: DocumentBuilder) => DocumentBuilder,
};

export async function configureApiApp(
  module: { name: string },
  options: TApiAppConfig,
  nestApplicationOptions?: NestApplicationOptions
) {

  const {
    project,
    appRoot,
    corsOptions,
    globalPrefix,
    title,
    version,
    documentBuilder,
  } = options;

  const app = await NestFactory.create(module, nestApplicationOptions);

  if(globalPrefix) {
    app.setGlobalPrefix(globalPrefix);
  }
  app.enableCors(corsOptions);
  app.enableShutdownHooks();
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  await initOpenapi(app, title || module.name, project, appRoot, version, documentBuilder);

  return app;
}
