import { MigrationInterface, QueryRunner } from "typeorm";

export class permitMigration1659787021000 implements MigrationInterface{
    name = 'permitMigration1659787021000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "permit_entity" 
                    ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, 
                    "extractor" varchar NOT NULL, 
                    "box_id" varchar NOT NULL, 
                    "box_serialized" varchar NOT NULL, 
                    "block" varchar NOT NULL
                )`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "permit_entity"`);
    }
}
