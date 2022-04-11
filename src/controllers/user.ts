import { Router, Request, Response, NextFunction } from 'express';
import { User } from 'src/domain/user';

interface IUserService {
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    create(user: User): Promise<User>;
    update(id: string, updatedUser: User): Promise<User>;
    delete(id: string): Promise<number>;
}

export class UsersController {
    private readonly userService: IUserService;

    private router: Router;

    public constructor(userService: IUserService) {
        this.userService = userService;
        this.router = Router();
        this.router.get('/:id', this.getById.bind(this));
        this.router.put('/:id', this.put.bind(this));
        this.router.delete('/:id', this.delete.bind(this));
        this.router.get('/', this.get.bind(this));
        this.router.post('/', this.post.bind(this));
    }

    getRouter(): Router {
        return this.router;
    }

    public async get(_: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const users = await this.userService.findAll();
            return res.status(200).json(users);
        } catch (err) {
            return next(err);
        }
    }

    public async getById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { id } = req.params;
            const user = await this.userService.findOne(id);
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }

    public async post(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const newUser = req.body as User;
            const user = await this.userService.create(newUser);
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }

    public async put(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { id } = req.params;
            const updatedUser = req.body as User;
            const user = await this.userService.update(id, updatedUser);
            return res.status(200).json(user);
        } catch (err) {
            return next(err);
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { id } = req.params;
            const affected = await this.userService.delete(id);
            return res.status(200).json({ affected });
        } catch (err) {
            return next(err);
        }
    }
}
