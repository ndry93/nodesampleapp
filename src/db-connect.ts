import { createConnection, Connection } from 'typeorm';
import { PostgresDriver } from 'typeorm/driver/postgres/PostgresDriver';
import { Pool } from 'pg';

import { sleep } from 'src/libs/sleep';
import { OrmConfig } from 'src/libs/typeorm/ormconfig';
import { IS_TEST } from 'src/config';

// Handles unstable/intermitten connection lost to DB
function connectionGuard(connection: Connection) {
    // Access underlying pg driver
    if (connection.driver instanceof PostgresDriver) {
        const pool = connection.driver.master as Pool;

        // Add handler on pool error event
        pool.on('error', async (err) => {
            await connection.close();

            while (!connection.isConnected) {
                await connection.connect(); // eslint-disable-line

                if (!connection.isConnected) {
                    // Throttle retry
                    await sleep(500); // eslint-disable-line
                }
            }
        });
    }
}

// 1. Wait for db to come online and connect
// 2. On connection instability, able to reconnect
// 3. The app should never die due to connection issue
// 3.a. We rethrow the connection error in test mode to prevent open handles issue in Jest
export async function connect(): Promise<void> {
    let connection: Connection;
    let isConnected = false;

    while (!isConnected) {
        try {
            connection = await createConnection(OrmConfig); // eslint-disable-line
            isConnected = connection.isConnected;
        } catch (error) {
            console.error(error);
            if (IS_TEST) {
                throw error;
            }
        }

        if (!isConnected) {
            // Throttle retry
            await sleep(500); // eslint-disable-line
        }
    }

    connectionGuard(connection);
}
