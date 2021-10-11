import { Entity, Column, ObjectIdColumn, ObjectID  } from "typeorm";

@Entity()
export default class SiteEntity {
    @ObjectIdColumn()
    id!: ObjectID;

    @Column()
    data!: any;
}