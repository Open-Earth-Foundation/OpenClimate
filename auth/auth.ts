import {Request, Response} from "express";
import {verify} from "jsonwebtoken";
import { AuthenticatedRequest } from "./auth.interface";
import {ACCESS_TOKEN_SECRET} from "./secret";

export async function auth(req: AuthenticatedRequest, res: Response, next: Function): Promise<void> {
    if (req.url === '/api/get-all-users') {
        next();
        return;
    }

    if (req.url === '/api/login' || req.url === '/api/register') {
        next();
        return;
    }

    if (req.cookies['SESSIONID']) {
        const token = req.cookies['SESSIONID'];

        verify(token, ACCESS_TOKEN_SECRET, (err: any, user: any) => {
            if (err) {
                return res.sendStatus(401);
            }

            req['user'] = user;
            next();
        });

    } else {
        if (req.url === '/api/user') {
            res.status(200).send(null);
        } else {
            res.sendStatus(403);
        }
    }
}
