import { clearDB, loadDataBase, permitTxGenerator } from "./utilsFunctions.mock";
import { PermitExtractor } from "./permitExtractor";
import { PermitEntity } from "../entities/PermitEntity";
import { block, permitAddress, RWTId } from "./utilsVariable.mock";

const dataSourcePromise = loadDataBase();

describe('permitExtractor', () => {

    /**
     * getting id of the extractor tests
     * Dependency: Nothing
     * Scenario: calling getId of CommitmentExtractor
     * Expected: getId should return 'extractorId'
     */
    describe("getId", () => {
        it("should return id of the extractor", async () => {
            const dataSource = await dataSourcePromise;
            const extractor = new PermitExtractor("extractorId", dataSource, permitAddress, RWTId);
            const data = extractor.getId();
            expect(data).toBe("extractorId");
        })
    })
    describe("processTransactions", () => {

        /**
         * 3 valid commitment should save successfully
         * Dependency: Nothing
         * Scenario: block with 3 transaction passed to the function and 3 of the transactions are valid permit
         * Expected: processTransactions should returns true and database row count should be 3
         */
        it("should save 3 permits", async () => {
            const dataSource = await dataSourcePromise;
            const extractor = new PermitExtractor("extractorId", dataSource, permitAddress, RWTId);
            const tx1 = permitTxGenerator(true, 'wid1');
            const tx2 = permitTxGenerator(true, 'wid2');
            const tx3 = permitTxGenerator(true, 'wid3');
            const res = await extractor.processTransactions([tx1, tx2, tx3], block);
            expect(res).toBeTruthy();
            const repository = dataSource.getRepository(PermitEntity);
            const [, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(3);
            await clearDB(dataSource);
        })

        /**
         * 3 valid commitment should save successfully
         * Dependency: Nothing
         * Scenario: block with 3 transaction passed to the function and 2 of the transactions are valid permit
         * Expected: processTransactions should returns true and database row count should be 2
         */
        it("should save 2 permits out of 3 transaction", async () => {
            const dataSource = await dataSourcePromise;
            const extractor = new PermitExtractor("extractorId", dataSource, permitAddress, RWTId);
            const tx1 = permitTxGenerator(true, 'wid1');
            const tx2 = permitTxGenerator(false, 'wid2');
            const tx3 = permitTxGenerator(true, 'wid3');
            const tx4 = permitTxGenerator(false, 'wid3');
            const res = await extractor.processTransactions([tx1, tx2, tx3, tx4], block);
            expect(res).toBeTruthy();
            const repository = dataSource.getRepository(PermitEntity);
            const [, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(2);
            await clearDB(dataSource);
        })

    })
    describe("forkBlock", () => {

        /**
         * forkBlock should delete block from database
         * Dependency: Nothing
         * Scenario: 3 valid permit saved in the dataBase, and then we call forkBlock
         * Expected: afterCalling forkBlock database row count should be 0
         */
        it("should remove only block with specific block id and extractor id", async () => {
            const dataSource = await dataSourcePromise;
            const extractor = new PermitExtractor("extractorId", dataSource, permitAddress, RWTId);
            const tx1 = permitTxGenerator(true, 'wid1');
            const tx2 = permitTxGenerator(true, 'wid2');
            const tx3 = permitTxGenerator(true, 'wid3');
            await extractor.processTransactions([tx1, tx2, tx3], block);
            await extractor.forkBlock('hash');
            const repository = dataSource.getRepository(PermitEntity);
            const [, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(0);
            await clearDB(dataSource);
        });
    })

})
