import { MigrationInterface, QueryRunner } from "typeorm";

export class eventTriggerMigration1659787067000 implements MigrationInterface{
    name = 'eventTriggerMigration1659787067000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "event_trigger_entity" 
                    ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                    "extractor" varchar NOT NULL, 
                    "boxId" varchar NOT NULL, 
                    "boxSerialized" varchar NOT NULL, 
                    "block" varchar NOT NULL,
                    "fromChain" varchar NOT NULL,
                    "toChain" varchar NOT NULL,
                    "fromAddress" varchar NOT NULL,
                    "toAddress" varchar NOT NULL,
                    "amount" varchar NOT NULL,
                    "bridgeFee" varchar NOT NULL,
                    "networkFee" varchar NOT NULL,
                    "sourceChainTokenId" varchar NOT NULL,
                    "sourceTxId" varchar NOT NULL,
                    "WIDs" varchar NOT NULL
                )`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "event_trigger_entity"`);
    }
}
