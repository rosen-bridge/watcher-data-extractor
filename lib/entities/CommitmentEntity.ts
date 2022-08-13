import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class CommitmentEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    extractor: string;

    @Column()
    eventId: string;

    @Column()
    commitment: string;

    @Column()
    WID: string;

    @Column()
    commitmentBoxId: string;

    @Column()
    blockId: string;

    @Column()
    height: number

    @Column({nullable: true})
    spendBlockHash?: string;

    @Column({nullable: true})
    spendBlockHeight?: number;
}

export default CommitmentEntity;
