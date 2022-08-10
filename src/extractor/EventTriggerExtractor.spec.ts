import { clearDB, eventTriggerTxGenerator, loadDataBase } from "./utilsFunctions.mock";
import { EventTriggerExtractor } from "./EventTriggerExtractor";
import { EventTriggerEntity } from "../entities/EventTriggerEntity";
import { block, eventTriggerAddress, RWTId } from "./utilsVariable.mock";

const dataSourcePromise = loadDataBase();

describe("EventTriggerExtractor", () => {
    describe("getId", () => {

        /**
         * getting id of the extractor tests
         * Dependency: Nothing
         * Scenario: calling getId of CommitmentExtractor
         * Expected: getId should return 'extractorId'
         */
        it("should return id of the extractor", async () => {
            const dataSource = await dataSourcePromise;
            const extractor = new EventTriggerExtractor("extractorId", dataSource, eventTriggerAddress, RWTId);
            const data = extractor.getId();
            expect(data).toBe("extractorId");
        })
    })

    describe("processTransaction", () => {

        /**
         * 1 valid eventTrigger should save successfully
         * Dependency: Nothing
         * Scenario: block with 1 transaction passed to the function and 1 of the transactions are valid eventTrigger
         * Expected: processTransactions should returns true and database row count should be 1
         */
        it('should save one eventTrigger successfully', async () => {
            const dataSource = await dataSourcePromise;
            const extractor = new EventTriggerExtractor('extractorId', dataSource, eventTriggerAddress, RWTId);
            const tx1 = eventTriggerTxGenerator(true, ['wid1'], ['cardano', 'addr1', '1000', '10000']);
            const res = await extractor.processTransactions([tx1], block);
            expect(res).toBeTruthy();
            const repository = dataSource.getRepository(EventTriggerEntity);
            const [, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(1);
            await clearDB(dataSource);
        })

        /**
         * 2 valid eventTrigger should save successfully
         * Dependency: Nothing
         * Scenario: block with 5 transaction passed to the function and 2 of the transactions are valid eventTrigger
         * Expected: processTransactions should returns true and database row count should be 2
         */
        it('should save 2 eventTrigger successfully out of 4 transaction', async () => {
            const dataSource = await dataSourcePromise;
            const extractor = new EventTriggerExtractor('extractorId', dataSource, eventTriggerAddress, RWTId);
            const tx1 = eventTriggerTxGenerator(true, ['wid1'], ['cardano', 'addr1', '1000', '10000']);
            const tx2 = eventTriggerTxGenerator(true, [], ['cardano', 'addr1', '1000', '10000']);
            const tx3 = eventTriggerTxGenerator(false, ['wid3'], ['cardano', 'addr1', '1000', '10000']);
            const tx4 = eventTriggerTxGenerator(true, ['wid4'], ['cardano', 'addr1', '1000', '10000']);
            const tx5 = eventTriggerTxGenerator(true, ['wid5'], []);
            const res = await extractor.processTransactions([tx1, tx2, tx3, tx4, tx5], block);
            expect(res).toBeTruthy();
            const repository = dataSource.getRepository(EventTriggerEntity);
            const [, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(2);
            await clearDB(dataSource);
        })
    })

})
