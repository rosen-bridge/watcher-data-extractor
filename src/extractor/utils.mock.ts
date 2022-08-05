import { DataSource } from "typeorm";
import { BlockEntity } from "@rosen-bridge/scanner";
import { CommitmentEntity } from "../entities/CommitmentEntity";

export const loadDataBase = async (name: string): Promise<DataSource> => {
    return new DataSource({
        type: "sqlite",
        database: `./sqlite/${name}-test.sqlite`,
        entities: [BlockEntity, CommitmentEntity],
        migrations: [...migrations, ...scannerMigrations],
        synchronize: false,
        logging: false
    }).initialize().then(
        async (dataSource) => {
            await dataSource.runMigrations();
            return dataSource
        }
    );
}
