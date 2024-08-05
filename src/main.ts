import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
  .setTitle('Blog Pessoal')
  .setDescription('Projeto blog pessoal')
  .setContact('Fernando Cassio', 'https://github.com/fernandoCassiodev', 'fernandocassiodev@gmail.com')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/swagger', app, document)

  process.env.TZ = '-03:00';

  app.useGlobalPipes(new ValidationPipe()); // habilitamos o validation globalmente

  app.enableCors(); //habilitamos requisições de outras origens

  await app.listen(4000);
}
bootstrap();
