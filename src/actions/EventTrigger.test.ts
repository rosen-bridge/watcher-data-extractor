import { block, loadDataBase } from "../extractor/utils.mock";
import { EventTriggerEntity } from "../entities/EventTriggerEntity";
import { EventTriggerDB } from "./EventTriggerDB";

const sampleBox1 = {
    boxId: "1",
    boxSerialized: "serialized1",
}
const sampleBox2 = {
    boxId: "2",
    boxSerialized: "serialized2",
}


describe("EventTrigger", () => {
    describe("storeBoxes", () => {

        /**
         * 2 valid EventTrigger Box should save successfully
         * Dependency: Nothing
         * Scenario: 2 EventTrigger should save successfully
         * Expected: storeBoxes should returns true and database row count should be 2
         */
        it('gets two EventBoxes and dataBase row should be 2', async () => {
            const dataSource = await loadDataBase("EventTrigger-storeBoxes");
            const eventTrigger = new EventTriggerDB(dataSource);
            const res = await eventTrigger.storeBoxes([sampleBox1, sampleBox2], block, 'extractor1');
            expect(res).toBe(true);
            const repository = dataSource.getRepository(EventTriggerEntity);
            const [, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(2);
        })
    })

    describe('deleteBlock', () => {

        /**
         * deleting all EventTrigger correspond to a block hash
         * Dependency: Nothing
         * Scenario: 1 EventTrigger should exist in the dataBase
         * Expected: deleteBlock should call without no error and database row count should be 1
         */
        it('should deleted one row of the dataBase correspond to one block', async () => {
            const dataSource = await loadDataBase("EventTrigger-deleteBlock");
            const eventTrigger = new EventTriggerDB(dataSource);
            await eventTrigger.storeBoxes([sampleBox1], block, 'extractor1');
            await eventTrigger.storeBoxes([sampleBox2], {...block, hash: 'hash2'}, 'extractor2');
            const repository = dataSource.getRepository(EventTriggerEntity);
            let [_, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(2);
            await eventTrigger.deleteBlock('hash', 'extractor1');
            [_, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(1);
        })
    })
})
