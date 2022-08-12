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

    @Column({nullable: true})
    spendBlock?: string;
}

export default CommitmentEntity;
