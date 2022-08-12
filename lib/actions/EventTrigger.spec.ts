import { clearDB, loadDataBase } from "../extractor/utilsFunctions.mock";
import EventTriggerEntity from "../entities/EventTriggerEntity";
import EventTriggerDB from "./EventTriggerDB";
import { ExtractedEventTrigger } from "../interfaces/extractedEventTrigger";
import { block } from "../extractor/utilsVariable.mock";
import { DataSource } from "typeorm";

const sampleBox1: ExtractedEventTrigger = {
    WIDs: "wid2",
    amount: "22",
    bridgeFee: "11",
    fromAddress: "ergoAddress1",
    fromChain: "ergo",
    networkFee: "88",
    sourceChainTokenId: "tokenId2",
    targetChainTokenId: "asset2",
    sourceTxId: "txId2",
    toAddress: "addr4",
    toChain: "cardano",
    boxId: "1",
    boxSerialized: "serialized1",
    sourceBlockId: "blockId",
}
const sampleBox2: ExtractedEventTrigger = {
    WIDs: "1",
    amount: "100",
    bridgeFee: "10",
    fromAddress: "address",
    fromChain: "ergo",
    networkFee: "1000",
    sourceChainTokenId: "tokenId1",
    targetChainTokenId: "asset1",
    sourceTxId: "txId1",
    toAddress: "addr1",
    toChain: "cardano",
    boxId: "2",
    boxSerialized: "serialized2",
    sourceBlockId: "blockId",
}

let dataSource: DataSource;

describe("EventTrigger", () => {
    beforeAll(async () => {
        dataSource = await loadDataBase();
    });

    beforeEach(async () => {
        await clearDB(dataSource);
    })

    describe("storeBoxes", () => {

        /**
         * 2 valid EventTrigger Box should save successfully
         * Dependency: Nothing
         * Scenario: 2 EventTrigger should save successfully
         * Expected: storeBoxes should returns true and database row count should be 2
         */
        it('gets two EventBoxes and dataBase row should be 2', async () => {
            const eventTrigger = new EventTriggerDB(dataSource);
            const res = await eventTrigger.storeEventTriggers([sampleBox1, sampleBox2], block, 'extractor1');
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
            const eventTrigger = new EventTriggerDB(dataSource);
            await eventTrigger.storeEventTriggers([sampleBox1], block, 'extractor1');
            await eventTrigger.storeEventTriggers([sampleBox2], {...block, hash: 'hash2'}, 'extractor2');
            const repository = dataSource.getRepository(EventTriggerEntity);
            let [_, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(2);
            await eventTrigger.deleteBlock('hash', 'extractor1');
            [_, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(1);
            await dataSource.getRepository(EventTriggerEntity).createQueryBuilder().softDelete();
        })
    })
})
