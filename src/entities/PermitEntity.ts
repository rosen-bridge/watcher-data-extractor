import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PermitEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    extractor: string;

    @Column()
    boxId: string

    @Column()
    boxSerialized: string

    @Column()
    block: string
}