import { block, loadDataBase, permitAddress, permitTxGenerator, RWTId } from "./utils.mock";
import { PermitExtractor } from "./permitExtractor";
import { PermitEntity } from "../entities/PermitEntity";


describe('permitExtractor', () => {
    describe("getId", () => {
        it("should return id of the extractor", async () => {
            const db = await loadDataBase("permit");
            const extractor = new PermitExtractor("extractorId", db, permitAddress, RWTId);
            const data = extractor.getId();
            expect(data).toBe("extractorId");
        })
    })
    describe("processTransactions", () => {
        it("", async () => {
            const dataSource = await loadDataBase("permit-1");
            const extractor = new PermitExtractor("extractorId", dataSource, permitAddress, RWTId);
            const tx1 = permitTxGenerator();
            const tx2 = permitTxGenerator();
            const tx3 = permitTxGenerator();
            const res = await extractor.processTransactions([tx1, tx2, tx3], block);
            expect(res).toBeTruthy();
            const repository = dataSource.getRepository(PermitEntity);
            const [, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(3);
        })

        it("", async () => {
            const dataSource = await loadDataBase("permit-2");
            const extractor = new PermitExtractor("extractorId", dataSource, permitAddress, RWTId);
            const tx1 = permitTxGenerator();
            const tx2 = permitTxGenerator(false);
            const tx3 = permitTxGenerator();
            const res = await extractor.processTransactions([tx1, tx2,tx3], block);
            expect(res).toBeTruthy();
            const repository = dataSource.getRepository(PermitEntity);
            const [, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(2);
        })

    })
    describe("forkBlock", () => {
        it("", async () => {
            const dataSource = await loadDataBase("permit-1");
            const extractor = new PermitExtractor("extractorId", dataSource, permitAddress, RWTId);
            const tx1 = permitTxGenerator();
            const tx2 = permitTxGenerator();
            const tx3 = permitTxGenerator();
            await extractor.processTransactions([tx1, tx2, tx3], block);
            await extractor.forkBlock('hash');
            const repository = dataSource.getRepository(PermitEntity);
            const [, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(0);
        });
    })

})





