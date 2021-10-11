import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ObjectIdColumn, ObjectID  } from "typeorm";

@Entity()
export default class UserEntity {
    @ObjectIdColumn()
    id!: ObjectID;

    @Column()
    firstName!: string;

    @Column()
    lastName!: string;

    @Column()
    email!: string;

    @Column()
    password!: string;
}