import { Entity, PrimaryGeneratedColumn, Column, PrimaryColumn, ObjectIdColumn, ObjectID  } from "typeorm";

@Entity()
export default class SchemaEntity {
    @ObjectIdColumn()
    id!: ObjectID;

    @Column()
    category!: string;

    @Column()
    type!: string;

    @Column()
    display_name!: string;

    @Column()
    fields!: string;
}