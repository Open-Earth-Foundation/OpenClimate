import crypto from 'crypto';
import { Request, Response, Router } from "express";
import { sign } from "jsonwebtoken";
import { getConnection } from 'typeorm';
import { ACCESS_TOKEN_SECRET } from "../auth/secret";
import UserEntity from '../entities/User';

const router = Router()


router.post('/api/register', async (req: Request, res: Response) => {
    try {
        const {firstName, lastName, email, password} = req.body;
        const passwordDigest = crypto.createHash('sha256').update(password).digest('hex');

        const usersRepository = getConnection().getRepository(UserEntity);

        const user = usersRepository.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: passwordDigest,
        });

        const result = await usersRepository.save(user);

        res.json(result);
    } catch(e) {
        console.log(e);
        res.status(500).send({code: 500, message: 'Server error'});
    }
});

router.post('/api/login', async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;
        console.log(email);
        
        const passwordDigest = crypto.createHash('sha256').update(password).digest('hex');

        const usersRepository = getConnection().getRepository(UserEntity);

        const user = await usersRepository.findOne({where: {email: {$eq: email}}});
        
        console.log(user);
        console.log(password);


        if (user && passwordDigest === user.password) {

            const accessToken = sign({
                email: user.email,
            }, ACCESS_TOKEN_SECRET);
            res.cookie('SESSIONID', accessToken, {
                httpOnly: true,
                secure: true
            });

            console.log(0);

            res.json({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                token: accessToken
            });

            console.log(1);

        } else {
            res.status(403).json({code: 403, message: 'Bad user'});
        }
    } catch (e) {
        console.log(500);
        res.status(500).send({code: 500, message: 'Server error'});
    }
});

router.get('/api/logout', async (req: Request, res: Response) => {
    try {
        res.clearCookie('SESSIONID');
        res.status(200).send({code: 200, message: 'OK'});
    } catch (e) {
        res.status(500).send({code: 500, message: 'Server error'});
    }
});

export default router
