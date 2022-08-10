import { loadDataBase } from "../extractor/utilsFunctions.mock";
import { PermitEntityAction } from "./permitDB";
import { PermitEntity } from "../entities/PermitEntity";
import { block } from "../extractor/utilsVariable.mock";

const sampleBox1 = {
    boxId: "1",
    boxSerialized: "serialized1",
    WID: "wid1",
}
const sampleBox2 = {
    boxId: "2",
    boxSerialized: "serialized2",
    WID: "wid2",
}

describe("PermitEntityAction", () => {
    describe("storeBoxes", () => {

        /**
         * 2 valid PermitBox should save successfully
         * Dependency: Nothing
         * Scenario: 2 PermitBox should save successfully
         * Expected: storeBoxes should returns true and database row count should be 2
         */
        it('gets two PermitBox and dataBase row should be 2', async () => {
            const dataSource = await loadDataBase("PermitEntity-storeBoxes");
            const permitEntity = new PermitEntityAction(dataSource);
            const res = await permitEntity.storePermits([sampleBox1, sampleBox2], block, 'extractor1');
            expect(res).toBe(true);
            const repository = dataSource.getRepository(PermitEntity);
            const [, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(2);
        })
    })

    /**
     * deleting all PermitBox correspond to a block hash
     * Dependency: Nothing
     * Scenario: 1 PermitBox should exist in the dataBase
     * Expected: deleteBlock should call without no error and database row count should be 1
     */
    describe("deleteBlock", () => {
        it('should deleted one row of the dataBase correspond to one block', async () => {
            const dataSource = await loadDataBase("PermitEntity-deleteBlock");
            const permitEntity = new PermitEntityAction(dataSource);
            let res = await permitEntity.storePermits([sampleBox1], block, 'extractor1');
            expect(res).toBe(true);
            res = await permitEntity.storePermits([sampleBox2], {...block, hash: "hash2"}, 'extractor2');
            expect(res).toBe(true);
            const repository = dataSource.getRepository(PermitEntity);
            let [_, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(2);
            await permitEntity.deleteBlock('hash', 'extractor1');
            [_, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(1);
        })
    })
})
