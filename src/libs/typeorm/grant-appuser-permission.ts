import { connect } from 'src/db-connect';
import { getConnection } from 'typeorm';

/*
    This script is to ensure the correct permissions are granted to the db user for application
    This will be run after migration has been done
    For more information, check out https://github.com/xendit/xendit-infrastructure/blob/master/terraform-modules/xendit-postgres-rbac/db-operations-guide.md#create-postgres-objects-by-executing-ddl-commands-using-migration-user
*/
(async function main() {
    try {
        await connect();
        const conn = getConnection();
        const queryRunner = conn.createQueryRunner();
        // TODO: Fill in the schema (e.g. public) and application db user name
        await queryRunner.query(`
            GRANT USAGE ON SCHEMA <schema name> TO <db user>;
            GRANT SELECT, INSERT, UPDATE, REFERENCES, TRIGGER ON ALL TABLES IN SCHEMA <schema name> TO <db user>;
            GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA <schema name> TO <db user>;
            GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA <schema name> TO <db user>;
        `);
        process.exit(0);
    } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
        process.exit(1);
    }
})();
