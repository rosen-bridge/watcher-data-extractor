import {
    block,
    commitmentAddress,
    commitmentTxGenerator,
    loadDataBase,
    permitAddress,
    RWTId
} from "./utils.mock";
import { PermitExtractor } from "./permitExtractor";
import { CommitmentExtractor } from "./commitmentExtractor";
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
        it('should save 2 commitments', async () => {
            const dataSource = await loadDataBase("commitment-processTransaction");
            const extractor = new CommitmentExtractor('extractorId', [commitmentAddress], RWTId, dataSource);
            const tx1 = commitmentTxGenerator(true, ['wid1'], ['1'], 'digest1');
            const tx2 = commitmentTxGenerator(true, ['wid2'], ['2'], 'digest2');
            const tx3 = commitmentTxGenerator(false, ['wid2'], ['2'], 'digest2');
            const res = await extractor.processTransactions([tx1, tx3, tx2], block);
            expect(res).toBeTruthy();
            const repository = dataSource.getRepository(CommitmentEntity);
            const [, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(2);
        })
    })

    describe("forkBlock", () => {
        it("should remove only block with specific block id and extractor id", async () => {
            const dataSource = await loadDataBase("commitment-forkBlock");
            const extractor = new CommitmentExtractor('extractorId', [commitmentAddress], RWTId, dataSource);
            const tx1 = commitmentTxGenerator(true, ['wid1'], ['1'], 'digest1');
            const tx2 = commitmentTxGenerator(true, ['wid2'], ['2'], 'digest2');
            const tx3 = commitmentTxGenerator(false, ['wid2'], ['2'], 'digest2');
            await extractor.processTransactions([tx1, tx2, tx3], block);
            await extractor.forkBlock('hash');
            const repository = dataSource.getRepository(CommitmentEntity);
            const [, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(0);
        });
    })

})

