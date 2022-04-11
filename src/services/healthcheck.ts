import { Connection, MigrationExecutor } from 'typeorm';

export class HealthcheckService {
    private db: Connection;

    private migrationExecutor: MigrationExecutor;

    constructor(db: Connection) {
        this.db = db;
        this.migrationExecutor = new MigrationExecutor(db, db.createQueryRunner('master'));
    }

    async isDBReady(): Promise<boolean> {
        if (!this.db.isConnected) {
            return false;
        }

        const pendingMigrations = await this.migrationExecutor.getPendingMigrations();
        return pendingMigrations.length === 0;
    }
}
