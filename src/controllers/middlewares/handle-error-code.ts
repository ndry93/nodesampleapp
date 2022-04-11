import { Request, NextFunction, Response } from 'express';
import { APP_ENV, APP_MODE } from 'src/config';
import { ErrorCodeMap, ErrorCodes } from 'src/domain/errors';

export const errorHandler = () => {
    // This is an express error handler, need to the 4 variable signature
    // eslint-disable-next-line
    return (err: any, req: Request, res: Response, next: NextFunction) => {
        if ((err.status)) {
            return res.status(err.status).json({
                message: err.message,
                error_code: err.error_code || ErrorCodes.API_VALIDATION_ERROR,
                // only exposed Xendit-API-standard compliant fields //
                errors: err.errors
                    ? err.errors.map((e: { path: string; message: string; doc_url?: string }) => ({
                          path: e.path, // eslint-disable-line
                          message: e.message, // eslint-disable-line @typescript-eslint/indent
                          doc_url: e.doc_url // eslint-disable-line @typescript-eslint/indent
                      })) // eslint-disable-line @typescript-eslint/indent
                    : err.errors
            });
        }

        const statusCode = Number(ErrorCodeMap[err.error_code]);

        if (!Number.isNaN(statusCode)) {
            const logContext = {
                error_code: err.error_code,
                status_code: statusCode,
                context: err.context
            };

            // _.defaults(logContext, req.safeLoggingRequestData); // to be determined what is this for

            return res.status(statusCode).send({
                error_code: err.error_code,
                message: err.message
            });
        }

        return res.status(500).send({
            error_code: 'SERVER_ERROR',
            message: 'Something unexpected happened, we are investigating this issue right now'
        });
    };
};
