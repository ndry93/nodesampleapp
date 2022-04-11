import { Request, Response, Router } from 'express';

export class RootController {
    private router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/', RootController.index);
    }

    getRouter(): Router {
        return this.router;
    }

    /**
     * GET /
     * Home
     */
    static index(_: Request, res: Response): Response {
        return res.status(200).json({ message: 'You have successfully started the application!' });
    }
}
