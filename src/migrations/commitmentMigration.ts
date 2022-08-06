import { MigrationInterface, QueryRunner } from "typeorm";

export class commitmentMigration1659787165000 implements MigrationInterface{
    name = 'commitmentMigration1659787165000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "commitment_entity" 
                    ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                    "extractor" varchar NOT NULL, 
                    "event_id" varchar NOT NULL, 
                    "commitment" varchar NOT NULL, 
                    "WID" varchar NOT NULL, 
                    "commitment_box_id" varchar NOT NULL, 
                    "block" varchar NOT NULL, 
                    "spend_block" varchar NOT NULL
                )`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "commitment_entity"`);
    }
}
