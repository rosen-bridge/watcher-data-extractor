import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class EventTriggerEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    extractor: string;

    @Column()
    boxId: string

    @Column()
    boxSerialized: string

    @Column()
    blockId: string

    @Column()
    height: number

    @Column()
    fromChain: string

    @Column()
    toChain: string

    @Column()
    fromAddress: string

    @Column()
    toAddress: string

    @Column()
    amount: string

    @Column()
    bridgeFee: string

    @Column()
    networkFee: string

    @Column()
    sourceChainTokenId: string

    @Column()
    targetChainTokenId: string

    @Column()
    sourceTxId: string

    @Column()
    sourceBlockId: string

    @Column()
    WIDs: string

}

export default EventTriggerEntity;
