import 'reflect-metadata'; // for TypeORM
import { getConnection, getCustomRepository } from 'typeorm';

import { NODE_ENV, SENTRY_DSN, SERVICE_NAME } from 'src/config';
import { connect } from 'src/db-connect';
import { RootController } from 'src/controllers/root';
import { HealthcheckController } from 'src/controllers/healthcheck';
import { UserService } from 'src/services/user';
import { UserRepository } from 'src/libs/typeorm/user';
import { UsersController } from 'src/controllers/user';
import { ErrorService } from 'src/services/error-example';
import { ErrorController } from 'src/controllers/error';
import { HealthcheckService } from './services/healthcheck';

/**
 * Initialize all ENV values and dependencies here so that they are re-usable across web servers, queue runners and crons
 */
/* eslint-disable  @typescript-eslint/no-explicit-any */
export async function init(): Promise<Record<string, any>> {
    const environment = NODE_ENV;

    // repositories
    await connect();
    const userRepo = getCustomRepository(UserRepository);

    // services
    const userService = new UserService(userRepo);
    const errorService = new ErrorService();
    const healthcheckService = new HealthcheckService(getConnection());

    // controllers
    const rootController = new RootController();
    const userController = new UsersController(userService);
    const errorController = new ErrorController(errorService);
    const healthcheckController = new HealthcheckController(healthcheckService);

    return {
        userRepo,

        userService,
        errorService,

        rootController,
        userController,
        errorController,
        healthcheckController
    };
}
