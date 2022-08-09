import { DataSource } from "typeorm";
import { extractedBox } from "../interfaces/extractedBox";
import { PermitEntity } from "../entities/PermitEntity";
import { BlockEntity } from "@rosen-bridge/scanner";

export class PermitEntityAction{
    private readonly datasource: DataSource;

    constructor(dataSource: DataSource) {
        this.datasource = dataSource;
    }

    /**
     * It stores list of permits in the dataSource with block id
     * @param permits
     * @param block
     */
    storeBoxes = async (permits: Array<extractedBox>, block: BlockEntity, extractor: string) => {
        const permitEntity = permits.map((box) => {
            const row = new PermitEntity();
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
            await queryRunner.manager.save(permitEntity);
            await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction();
            success = false;
        } finally {
            await queryRunner.release();
        }
        return success;
    }

    //TODO: should check if deleted or not Promise<Boolean>
    deleteBlock = async (block: string, extractor: string): Promise<void> => {
        await this.datasource.createQueryBuilder()
            .delete()
            .from(PermitEntity)
            .where("extractor = :extractor AND block = :block", {
                "block": block,
                "extractor": extractor
            }).execute()
    }
}
