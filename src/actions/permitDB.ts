import { DataSource } from "typeorm";
import { extractedPermit } from "../interfaces/extractedPermit";
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
     * @param extractor
     */
    storePermits = async (permits: Array<extractedPermit>, block: BlockEntity, extractor: string) => {
        const permitEntity = permits.map((permit) => {
            const row = new PermitEntity();
            row.boxId = permit.boxId;
            row.boxSerialized = permit.boxSerialized;
            row.blockId = block.hash;
            row.extractor = extractor;
            row.WID = permit.WID;
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

    /**
     * deleting all permits corresponding to the block(id) and extractor(id)
     * @param block
     * @param extractor
     */
    //TODO: should check if deleted or not Promise<Boolean>
    deleteBlock = async (block: string, extractor: string): Promise<void> => {
        await this.datasource.createQueryBuilder()
            .delete()
            .from(PermitEntity)
            .where("extractor = :extractor AND blockId = :block", {
                "block": block,
                "extractor": extractor
            }).execute()
    }
}
