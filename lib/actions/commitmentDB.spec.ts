import { clearDB, loadDataBase } from "../extractor/utilsFunctions.mock";
import CommitmentEntityAction from "./commitmentDB";
import CommitmentEntity from "../entities/CommitmentEntity";
import { block } from "../extractor/utilsVariable.mock";
import { DataSource } from "typeorm";

const commitment1 = {
    WID: "wid1",
    commitment: "commitment1",
    eventId: "eventId1",
    commitmentBoxId: "boxId1",
}

const commitment2 = {
    WID: "wid2",
    commitment: "commitment2",
    eventId: "eventId2",
    commitmentBoxId: "boxId2",
}

let dataSource: DataSource;

describe('commitmentEntityAction', () => {
    beforeAll(async () => {
        dataSource = await loadDataBase();
    });

    beforeEach(async () => {
        await clearDB(dataSource);
    })

    describe('storeCommitments', () => {

        /**
         * 2 valid Commitment should save successfully
         * Dependency: Nothing
         * Scenario: 2 Commitment should save successfully
         * Expected: storeCommitments should returns true and database row count should be 2
         */
        it('gets two commitments and dataBase row should be 2', async () => {
            const commitmentEntity = new CommitmentEntityAction(dataSource);
            const res = await commitmentEntity.storeCommitments([commitment1, commitment2], block, 'extractor1');
            expect(res).toBe(true);
            const repository = dataSource.getRepository(CommitmentEntity);
            const [, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(2);
        })
    })

    /**
     * testing spendBlock row update works correctly
     * Dependency: Nothing
     * Scenario: 1 commitments spendBlock should updated successfully
     * Expected: one commitment spendBlock should be equal to 'hash'
     */
    describe('spendCommitments', () => {
        it('sets one spendBlock for one commitments & one row should have spendBlock', async () => {
            const commitmentEntity = new CommitmentEntityAction(dataSource);
            const res = await commitmentEntity.storeCommitments([commitment1, commitment2], block, 'extractor1');
            expect(res).toBe(true);
            const repository = dataSource.getRepository(CommitmentEntity);
            expect((await repository.findBy({spendBlockHash: 'hash'})).length).toBe(0);
            await commitmentEntity.spendCommitments(['boxId2', 'boxId10'], block);
            expect((await repository.findBy({commitmentBoxId: 'boxId2', spendBlockHash: 'hash'})).length).toBe(1);
        })
    })

    describe('deleteBlockCommitment', () => {

        /**
         * deleting all commitments correspond to a block hash
         * Dependency: Nothing
         * Scenario: 1 commitment should exist in the dataBase
         * Expected: deleteBlock should call without no error and database row count should be 1
         */
        it('should deleted one row of the dataBase correspond to one block', async () => {
            const commitmentEntity = new CommitmentEntityAction(dataSource);
            await commitmentEntity.storeCommitments([commitment1], block, 'extractor1');
            await commitmentEntity.storeCommitments([commitment2], {...block, hash: 'hash2'}, 'extractor1');
            const repository = dataSource.getRepository(CommitmentEntity);
            let [_, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(2);
            await commitmentEntity.deleteBlockCommitment('hash', 'extractor1');
            [_, rowsCount] = await repository.findAndCount();
            expect(rowsCount).toBe(1);
        })
    })

})
