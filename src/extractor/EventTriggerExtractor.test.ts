import { block, eventTriggerAddress, eventTriggerTxGenerator, loadDataBase, RWTId } from "./utils.mock";
import { EventTriggerExtractor } from "./EventTriggerExtractor";
import { EventTriggerEntity } from "../entities/EventTriggerEntity";


describe("EventTriggerExtractor", () => {
    describe("getId", () => {
        it("should return id of the extractor", async () => {
            const dataSource = await loadDataBase('eventTrigger-getId');
            const extractor = new EventTriggerExtractor("extractorId", dataSource, eventTriggerAddress, RWTId);
            const data = extractor.getId();
            expect(data).toBe("extractorId");
        })
    })

    describe("processTransaction", () => {
        it('should save one eventTrigger successfully', async () => {
            const dataSource = await loadDataBase('eventTrigger-processTransaction-1');
            const extractor = new EventTriggerExtractor('extractorId', dataSource, eventTriggerAddress, RWTId);
            const tx1 = eventTriggerTxGenerator(true, ['wid1']);
            const res = await extractor.processTransactions([tx1], block);
            expect(res).toBeTruthy();
            const repository = dataSource.getRepository(EventTriggerEntity);
            const [, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(1);
        })

        it('should save 2 eventTrigger successfully out of 4 transaction', async () => {
            const dataSource = await loadDataBase('eventTrigger-processTransaction-2');
            const extractor = new EventTriggerExtractor('extractorId', dataSource, eventTriggerAddress, RWTId);
            const tx1 = eventTriggerTxGenerator(true, ['wid1']);
            const tx2 = eventTriggerTxGenerator(true, []);
            const tx3 = eventTriggerTxGenerator(false, ['wid3']);
            const tx4 = eventTriggerTxGenerator(true, ['wid4']);
            const res = await extractor.processTransactions([tx1, tx2,tx3,tx4], block);
            expect(res).toBeTruthy();
            const repository = dataSource.getRepository(EventTriggerEntity);
            const [, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(2);
        })
    })

})
