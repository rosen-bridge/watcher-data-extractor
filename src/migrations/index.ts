import { permitMigration1659787021000 } from "./permitMigration";
import { commitmentMigration1659787165000 } from "./commitmentMigration";
import { eventTriggerMigration1659787067000 } from "./eventTriggerMigration";

export const migrations = [permitMigration1659787021000, commitmentMigration1659787165000, eventTriggerMigration1659787067000];

