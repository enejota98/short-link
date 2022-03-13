import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('link')
export class Link{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    code: string;

    @Column()
    url: string;

    @Column({
        default: 0
    })
    hits: number;
}