import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppModule } from './../src/app.module';
import * as request from 'supertest';

describe('Testes dos Módulos Tema e Auth (e2e)', () => {
    let token: any;
    let temaId: any;
    let temaDescricao: any

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

    it("03 - Deve cadastrar um novo tema", async () => {
        const resposta = await request(app.getHttpServer())
            .post('/temas')
            .set('Authorization', token)
            .send({
                descricao: 'teste',
            })
            .expect(201);

        temaId = resposta.body.id;
        temaDescricao = resposta.body.descricao
    })

    it("04 - deve deve listar todos os temas", async () => {
        return await request(app.getHttpServer())
            .get('/temas')
            .set('Authorization', token)
            .expect(200);
    })

    it("05 - deve atualizar os dados do tema", async () => {
        return await request(app.getHttpServer())
            .put('/temas')
            .set('Authorization', token)
            .send({
                id: temaId,
                descricao: 'teste1'
            })
            .expect(200)
            .then(resposta => {
                expect("teste1").toEqual(resposta.body.descricao)
            });
    })

    it("06 - deve consultar um tema pelo id", async () => {
        return await request(app.getHttpServer())
            .get(`/temas/${temaId}`)
            .set('Authorization', token)
            .expect(200)
    })

    it("07 - deve consultar um tema pela descrição", async () => {
        return await request(app.getHttpServer())
            .get(`/temas/descricao/${temaDescricao}`)
            .set('Authorization', token)
            .expect(200)
    })


});