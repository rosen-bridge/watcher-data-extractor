import { MigrationInterface, QueryRunner } from "typeorm";

export class commitmentMigration1659787165000 implements MigrationInterface{
    name = 'commitmentMigration1659787165000'

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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "commitment_entity"`);
    }
}
