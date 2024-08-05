import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from './../src/app.module';
import * as request from 'supertest';

describe('Testes dos Módulos Postagem e Auth (e2e)', () => {
  let token: any;
  let postagemId : any;
  let postagemTitulo: any

  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + './../src/**/entities/*.entity.ts'],
          synchronize: true,
          dropSchema: true
        }),
        AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe);
    await app.init();

  });

  afterAll(
    async () => await app.close()
  );

  it("01 - Deve cadastrar um novo usuário", async () => {
    const resposta = await request(app.getHttpServer())
    .post('/usuarios/cadastrar')
    .send({
      nome: 'Root',
      usuario: 'root@root.com',
      senha: 'rootroot',
      foto: '-'
    })
    .expect(201);
  })

  it("02 - deve autenticar um usuário (login)", async () => {
    const resposta = await request(app.getHttpServer())
    .post('/usuarios/logar')
    .send({
      usuario: 'root@root.com',
      senha: 'rootroot',
    })
    .expect(200);

    token = resposta.body.token;
  })

  it("03 - Deve cadastrar uma nova postagem", async () => {
    const resposta = await request(app.getHttpServer())
    .post('/postagens')
    .set('Authorization', token)
    .send({
      titulo: 'teste',
      texto: 'root@root.teste',
      data: '2002-01-11',
    })
    .expect(201);

    postagemId = resposta.body.id;
    postagemTitulo = resposta.body.titulo
  })

  it("04 - deve deve listar todas as postagens", async () => {
    return await request(app.getHttpServer())
    .get('/postagens')
    .set('Authorization', token)
    .expect(200);
  })

  it("05 - deve atualizar os dados da postagem", async () => {
    return await request(app.getHttpServer())
    .put('/postagens')
    .set('Authorization', token)
    .send({
      id: postagemId,
      titulo: 'teste',
      texto: 'root1@root.teste',
      data: '2005-01-11',
    })
    .expect(200)
    .then(resposta => {
      expect("teste").toEqual(resposta.body.titulo)
    });

    
  })

  it("06 - deve consultar uma postagem pelo id", async () => {
    return await request(app.getHttpServer())
    .get(`/postagens/${postagemId}`)
    .set('Authorization', token)
    .expect(200)
  })

  it("07 - deve consultar uma postagem pelo titulo", async () => {
    return await request(app.getHttpServer())
    .get(`/postagens/titulo/${postagemTitulo}`)
    .set('Authorization', token)
    .expect(200)
  })


});