import { DataSource } from "typeorm";
import { migrations } from "../migrations";
import { PermitEntity } from "../entities/PermitEntity";
import { CommitmentEntity } from "../entities/CommitmentEntity";
import { EventTriggerEntity } from "../entities/EventTriggerEntity";
import { BlockEntity } from "@rosen-bridge/scanner";

export const loadDataBase = async (name: string): Promise<DataSource> => {
    return new DataSource({
        type: "sqlite",
        database: `./sqlite/${name}-test.sqlite`,
        entities: [PermitEntity, CommitmentEntity, EventTriggerEntity],
        migrations: migrations,
        synchronize: false,
        logging: false
    }).initialize().then(
        async (dataSource) => {
            await dataSource.runMigrations();
            return dataSource
        }
    );
}

export const permitAddress = "EE7687i4URb4YuSGSQXPCbAjMfN4dUt5Qx8BqKZJiZhDY8fdnSUwcAGqAsqfn1tW1byXB8nDrgkFzkAFgaaempKxfcPtDzAbnu9QfknzmtfnLYHdxPPg7Qtjy7jK5yUpPQ2M4Ps3h5kH57xWDJxcKviEMY11rQnxATjTKTQgGtfzsAPpqsUyT2ZpVYsFzUGJ4nSj4WaDZSU1Hovv6dPkSTArLQSjp38wE72ae6hbNJwXGkqgfBtdVXcZVtnqevw9xUNcE6i942CQ9hVMfbdRobnsaLgsDLQomsh8jLMXqkMde5qH2vGBUqnLKgjxCZaa7vStpPXT5EuzLn9napGwUcbJjgRk69FsRSfCrcydZbYxw4Gnh6ZB9at2USpwL1HdVkHVh8M6Kbw6ppRfeG4JeFsUw33H4sSRk6UPqfuFcRUf7Cec2vmPezXTPT7CXQqEeCjxmWXqfyEQUfnCwpiH5fQ9A8CQ3jTyFhxBTpoGDdtiVCmhqhKxjh9M7gcjpr1dUjGMCWxjir94ejfq24XQrSscrZuUT5NVHTWAkzQ"
export const RWTId = "3c6cb596273a737c3e111c31d3ec868b84676b7bad82f9888ad574b44edef267"
export const block: BlockEntity = {
    height: 10,
    hash: "hash",
    parentHash: "parentHash",
    status: "hi",
    scanner: "1"
}
