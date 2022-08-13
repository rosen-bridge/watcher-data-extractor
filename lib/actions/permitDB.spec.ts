import { clearDB, loadDataBase } from "../extractor/utilsFunctions.mock";
import PermitEntityAction from "./permitDB";
import PermitEntity from "../entities/PermitEntity";
import { block } from "../extractor/utilsVariable.mock";
import { DataSource } from "typeorm";

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

let dataSource: DataSource;

describe("PermitEntityAction", () => {
    beforeAll(async () => {
        dataSource = await loadDataBase();
    });

    beforeEach(async () => {
        await clearDB(dataSource);
    })

    describe("storePermits", () => {

        /**
         * 2 valid PermitBox should save successfully
         * Dependency: Nothing
         * Scenario: 2 PermitBox should save successfully
         * Expected: storeBoxes should returns true and database row count should be 2
         */
        it('gets two PermitBox and dataBase row should be 2', async () => {
            const permitEntity = new PermitEntityAction(dataSource);
            const res = await permitEntity.storePermits([sampleBox1, sampleBox2], block, 'extractor1');
            expect(res).toBe(true);
            const repository = dataSource.getRepository(PermitEntity);
            const [, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(2);
        })
    })

    describe("spendPermits", () => {
        it('sets one spendBlock for one permit & one row should have spendBlock', async () => {
            const permitEntity = new PermitEntityAction(dataSource);
            const res = await permitEntity.storePermits([sampleBox1, sampleBox2], block, 'extractor1');
            expect(res).toBe(true);
            const repository = dataSource.getRepository(PermitEntity);
            expect((await repository.findBy({spendBlockHash: 'hash'})).length).toBe(0);
            await permitEntity.spendPermits(['1', 'boxId10'], block);
            expect((await repository.findBy({boxId: '1', spendBlockHash: 'hash'})).length).toBe(1);
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
