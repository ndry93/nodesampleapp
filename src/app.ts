import express, { Application, RequestHandler } from 'express';
import httpContext from 'express-http-context';
import bodyParser from 'body-parser';
import compression from 'compression';
import helmet from 'helmet';

import { PORT } from 'src/config';
import { errorHandler } from 'src/controllers/middlewares/handle-error-code';

import { init } from 'src/init';

/**
 * Setup the application routes with controllers
 * @param app
 */
async function setupRoutes(app: Application) {
    const { rootController, userController, errorController, healthcheckController } =
        await init();

    app.use('/api/users', userController.getRouter());
    app.use('/healthcheck', healthcheckController.getRouter());
    app.use('/errors', errorController.getRouter());
    app.use('/', rootController.getRouter());
}

/**
 * Main function to setup Express application here
 */
export async function createApp(): Promise<express.Application> {
    const app = express();
    app.set('port', PORT);
    app.use(helmet() as RequestHandler);
    app.use(compression());
    app.use(bodyParser.json({ limit: '5mb', type: 'application/json' }) as RequestHandler);
    app.use(bodyParser.urlencoded({ extended: true }) as RequestHandler);

    // This should be last, right before routes are installed
    // so we can have access to context of all previously installed
    // middlewares inside our routes to be logged
    app.use(httpContext.middleware);

    await setupRoutes(app);

    // In order for errors from async controller methods to be thrown here,
    // you need to catch the errors in the controller and use `next(err)`.
    // See https://expressjs.com/en/guide/error-handling.html
    app.use(errorHandler());

    return app;
}
