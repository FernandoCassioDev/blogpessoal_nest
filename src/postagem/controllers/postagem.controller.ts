import { Get, Controller, HttpCode, HttpStatus, ParseIntPipe, Param, Post, Body, Put, Delete, UseGuards } from "@nestjs/common";
import { PostagemService } from "../services/postagem.service";
import { Postagem } from "../entities/postagem.entity";
import { JwtAuthGuard } from "../../auth/guard/jwt-auth.guard";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags('Postagem')
@UseGuards(JwtAuthGuard)
@Controller("/postagens")
@ApiBearerAuth()
export class PostagemController {
    constructor(private readonly postagemService: PostagemService) {}

    @Get()
    @HttpCode(HttpStatus.OK) //http status 200
    findAll(): Promise<Postagem[]> {
        return this.postagemService.findAll()
    }

    @Get('/:id')
    @HttpCode(HttpStatus.OK) //http status 200
    findById(@Param('id', ParseIntPipe) id: number): Promise<Postagem> {
        return this.postagemService.findById(id)
    }

    @Get('/titulo/:titulo')
    @HttpCode(HttpStatus.OK) //http status 200
    findByTitle(@Param('titulo') titulo: string): Promise<Postagem[]> {
        return this.postagemService.findByTitle(titulo)
    }

    @Post()
    @HttpCode(HttpStatus.CREATED) //http status 201
    create(@Body() postagem: Postagem): Promise<Postagem>{
        return this.postagemService.create(postagem)
    }

    @Put()
    @HttpCode(HttpStatus.OK) //http status 200
    update(@Body() postagem: Postagem): Promise<Postagem>{
        return this.postagemService.update(postagem)
    }

    @Delete('/:id')
    @HttpCode(HttpStatus.NO_CONTENT) //http status 204
    delete(@Param('id', ParseIntPipe) id: number){
        return this.postagemService.delete(id)
    }


}