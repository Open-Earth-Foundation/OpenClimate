import {Router} from 'express';
//import { IUser } from '../../models/User/IUser';
import { getMongoManager } from "typeorm";
import {getConnection} from "typeorm";
import UserEntity from '../entities/User';
import { sign } from "jsonwebtoken";

const router = Router()

router.post('/api/user', (req: any, res: any) => {
    try {
        const newUser: any = req.body;

        const userRepo = getConnection().getRepository(UserEntity);
        userRepo.save(newUser);
        
        console.log('User created');
    }
    catch(err:any) {
        console.log(err);
    }
})


export default router