import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ObjectIdColumn, ObjectID  } from "typeorm";

@Entity()
export default class PledgeEntity {
    @ObjectIdColumn()
    id!: ObjectID;

    @Column()
    data!: any;
}