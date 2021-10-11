import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ObjectIdColumn, ObjectID  } from "typeorm";

@Entity()
export default class TransferEntity {
    @ObjectIdColumn()
    id!: ObjectID;

    @Column()
    data!: any;
}