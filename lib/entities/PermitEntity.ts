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
}

export default PermitEntity;
