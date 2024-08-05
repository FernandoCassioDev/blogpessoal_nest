import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from './../src/app.module';
import * as request from 'supertest';

describe('Testes dos Módulos Usuario e Auth (e2e)', () => {
  let token: any;
  let usuarioId: any;

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

    usuarioId = resposta.body.id;
  })
  
  it("02 -Não deve cadastrar um usuário duplicado", async () => {
    await request(app.getHttpServer())
    .post('/usuarios/cadastrar')
    .send({
      nome: 'Root',
      usuario: 'root@root.com',
      senha: 'rootroot',
      foto: '-'
    })
    .expect(400);

  })

  it("03 - deve autenticar um usuário (login)", async () => {
    const resposta = await request(app.getHttpServer())
    .post('/usuarios/logar')
    .send({
      usuario: 'root@root.com',
      senha: 'rootroot',
    })
    .expect(200);

    token = resposta.body.token;
  })

  it("04 - deve deve listar todos usuários", async () => {
    return await request(app.getHttpServer())
    .get('/usuarios/all')
    .set('Authorization', token)
    .expect(200);
  })

  it("05 - deve atualizar os dados do usuário", async () => {
    const resposta = await request(app.getHttpServer())
    .put('/usuarios/atualizar')
    .set('Authorization', token)
    .send({
      id: usuarioId,
      nome: 'Adm',
      usuario: 'root@root.com',
      senha: 'rootroot',
      foto: 'nova foto'
    })
    .expect(200)
    .then(resposta => {
      expect("Adm").toEqual(resposta.body.nome)
    });

  })

  it("06 deve consultar um usuario pelo id", async () => {
    return await request(app.getHttpServer())
    .get(`/usuarios/${usuarioId}`)
    .set('Authorization', token)
    .expect(200)
  })
});
