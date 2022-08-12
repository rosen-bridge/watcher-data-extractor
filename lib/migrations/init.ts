import { MigrationInterface, QueryRunner } from "typeorm";

export class initMigration1659787165000 implements MigrationInterface{
    name = 'initMigration1659787165000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "commitment_entity" 
                    ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                    "extractor" varchar NOT NULL, 
                    "eventId" varchar NOT NULL, 
                    "commitment" varchar NOT NULL, 
                    "WID" varchar NOT NULL, 
                    "commitmentBoxId" varchar NOT NULL, 
                    "blockId" varchar NOT NULL, 
                    "spendBlock" varchar
                )`
        );
        await queryRunner.query(
            `CREATE TABLE "event_trigger_entity" 
                    ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                    "extractor" varchar NOT NULL, 
                    "boxId" varchar NOT NULL, 
                    "boxSerialized" varchar NOT NULL, 
                    "blockId" varchar NOT NULL,
                    "fromChain" varchar NOT NULL,
                    "toChain" varchar NOT NULL,
                    "fromAddress" varchar NOT NULL,
                    "toAddress" varchar NOT NULL,
                    "amount" varchar NOT NULL,
                    "bridgeFee" varchar NOT NULL,
                    "networkFee" varchar NOT NULL,
                    "sourceChainTokenId" varchar NOT NULL,
                    "targetChainTokenId" varchar NOT NULL,
                    "sourceBlockId" varchar NOT NULL,
                    "sourceTxId" varchar NOT NULL,
                    "WIDs" varchar NOT NULL
                )`
        );
        await queryRunner.query(
            `CREATE TABLE "permit_entity" 
                    ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                    "extractor" varchar NOT NULL, 
                    "boxId" varchar NOT NULL, 
                    "boxSerialized" varchar NOT NULL, 
                    "blockId" varchar NOT NULL,
                    "WID" varchar NOT NULL
                )`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "commitment_entity"`);
        await queryRunner.query(`DROP TABLE "event_trigger_entity"`);
        await queryRunner.query(`DROP TABLE "permit_entity"`);
    }
}
