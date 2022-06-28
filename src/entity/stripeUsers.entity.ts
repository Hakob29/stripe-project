import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { SharedProp } from "./shared-prop";

@Entity()
export class StripeUsers extends SharedProp{

    @PrimaryGeneratedColumn({
        type: "bigint"
    })
    id: number

    @Column({
        nullable: false,
        default: ""
    })
    name: string

    @Column({
        nullable: false,
        default: ""
    })
    email: string


    @Column({
        nullable: false,
        default: ""
    })
    password: string
}