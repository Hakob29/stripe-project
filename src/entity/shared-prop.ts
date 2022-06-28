import {CreateDateColumn,  UpdateDateColumn } from "typeorm";

export class SharedProp{

    @CreateDateColumn({
        type: "datetime"
    })
    createdAt: Date

    @UpdateDateColumn({
        type: "datetime"
    })
    updatedAt: Date

}