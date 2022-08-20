import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class PermitEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    extractor: string;

    @Column()
    boxId: string

    @Column()
    boxSerialized: string

    @Column()
    WID: string

    @Column()
    blockId: string

    @Column()
    height: number

    @Column({nullable: true})
    spendBlock!: string;

    @Column({nullable: true})
    spendHeight?: number;
}

export default PermitEntity;
