import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty } from "class-validator";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Tema } from "../../tema/entities/tema.entity";

@Entity({name: "tb_postagens"})
export class Postagem {

    @PrimaryGeneratedColumn() //Chave primária Autoimcremental
    id: number;

    @Transform(({ value }: TransformFnParams) => value?.trim()) // verificar se o titulo não é um espaço vazio
    @IsNotEmpty() //não aceitar titulo vazio
    @Column({length: 100, nullable: false}) // definir o tamanho e não aceitar número
    titulo: string;

    @Transform(({ value }: TransformFnParams) => value?.trim())// verificar se o texto não é um espaço vazio
    @IsNotEmpty()
    @Column({length: 1000, nullable: false})
    texto: string;

    @UpdateDateColumn() //A data e a hora serão preenchidas automaticamente
    data: Date;

    //muitos para um,ou seja, muitas postagens possuem um tema
    @ManyToOne(() => Tema, (tema) => tema.postagem, {
        onDelete: "CASCADE"
    })
    tema: Tema;
}