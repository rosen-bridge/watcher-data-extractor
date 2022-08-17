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
    spendBlockHash!: string;

    @Column({nullable: true})
    spendBlockHeight?: number;
}

export default PermitEntity;
