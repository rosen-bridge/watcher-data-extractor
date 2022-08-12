import { DataSource } from "typeorm";
import EventTriggerEntity from "../entities/EventTriggerEntity";
import { BlockEntity } from "@rosen-bridge/scanner";
import { ExtractedEventTrigger } from "../interfaces/extractedEventTrigger";

class EventTriggerDB{
    private readonly datasource: DataSource;

    constructor(dataSource: DataSource) {
        this.datasource = dataSource;
    }

    /**
     * It stores list of wids in the dataSource with block id
     * @param wids
     * @param block
     * @param extractor
     */
    storeEventTriggers = async (wids: Array<ExtractedEventTrigger>, block: BlockEntity, extractor: string) => {
        const widEntity = wids.map((event) => {
            const row = new EventTriggerEntity();
            row.boxId = event.boxId;
            row.boxSerialized = event.boxSerialized;
            row.blockId = block.hash;
            row.extractor = extractor;
            row.WIDs = event.WIDs;
            row.amount = event.amount;
            row.bridgeFee = event.bridgeFee;
            row.fromAddress = event.fromAddress;
            row.toAddress = event.toAddress;
            row.fromChain = event.fromChain;
            row.networkFee = event.networkFee;
            row.sourceChainTokenId = event.sourceChainTokenId;
            row.targetChainTokenId = event.targetChainTokenId;
            row.sourceBlockId = event.sourceBlockId;
            row.toChain = event.toChain;
            row.sourceTxId = event.sourceTxId;
            return row;
        });
        let success = true;
        const queryRunner = this.datasource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.save(widEntity);
            await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction();
            success = false;
        } finally {
            await queryRunner.release();
        }
        return success;
    }

    /**
     * deleting all permits corresponding to the block(id) and extractor(id)
     * @param block
     * @param extractor
     */
    deleteBlock = async (block: string, extractor: string) => {
        await this.datasource.createQueryBuilder()
            .delete()
            .from(EventTriggerEntity)
            .where("extractor = :extractor AND blockId = :block", {
                "block": block,
                "extractor": extractor
            }).execute()
    }

}

export default EventTriggerDB;
