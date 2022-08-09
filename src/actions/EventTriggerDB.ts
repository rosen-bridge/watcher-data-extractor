import { DataSource } from "typeorm";
import { extractedBox } from "../interfaces/extractedBox";
import { EventTriggerEntity } from "../entities/EventTriggerEntity";
import { BlockEntity } from "@rosen-bridge/scanner";

export class EventTriggerDB{
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
    storeBoxes = async (wids: Array<extractedBox>, block: BlockEntity, extractor: string) => {
        const widEntity = wids.map((box) => {
            const row = new EventTriggerEntity();
            row.boxId = box.boxId;
            row.boxSerialized = box.boxSerialized;
            row.block = block.hash;
            row.extractor = extractor;
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

    deleteBlock = async (block: string, extractor: string) => {
        await this.datasource.createQueryBuilder()
            .delete()
            .from(EventTriggerEntity)
            .where("extractor = :extractor AND block = :block", {
                "block": block,
                "extractor": extractor
            }).execute()
    }

}
