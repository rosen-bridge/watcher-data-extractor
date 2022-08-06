import { block, commitmentAddress, commitmentTxGenerator, loadDataBase, permitAddress, RWTId } from "./utils.mock";
import { PermitExtractor } from "./permitExtractor";
import { CommitmentExtractor } from "./commitmentExtractor";
import { PermitEntity } from "../entities/PermitEntity";
import { CommitmentEntity } from "../entities/CommitmentEntity";

describe('CommitmentExtractor', () => {
    describe("getId", () => {
        it("should return id of the extractor", async () => {
            const db = await loadDataBase("commitment-getId");
            const extractor = new PermitExtractor("extractorId", db, permitAddress, RWTId);
            const data = extractor.getId();
            expect(data).toBe("extractorId");
        })
    })

    describe('processTransaction', () => {
        it('', async () => {
            const dataSource = await loadDataBase("commitment-processTransaction");
            const extractor = new CommitmentExtractor('extractorId', [commitmentAddress], RWTId, dataSource);
            const tx1 = commitmentTxGenerator(true, ['wid1'], ['1'], 'digest');
            const res = await extractor.processTransactions([tx1], block);
            expect(res).toBeTruthy();
            const repository = dataSource.getRepository(CommitmentEntity);
            const [, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(1);
        })
    })

})



