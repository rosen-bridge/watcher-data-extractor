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
            const dataSource = await loadDataBase("permit");
            const extractor = new PermitExtractor("extractorId", dataSource, permitAddress, RWTId);
            const tx = permitTxGenerator();
            const res = extractor.processTransactions([tx], block);
            expect(res).toBeTruthy();
            const repository = dataSource.getRepository(PermitEntity);
            const [, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(1);
        })
    })
})





