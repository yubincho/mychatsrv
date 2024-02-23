import {Column, Entity, ManyToOne} from "typeorm";
import {CommonEntity} from "../../common/entities/common.entity";
import {Category} from "../../category/entities/category.entity";

@Entity()
export class Product extends CommonEntity {

    @Column()
    public name : string;

    @Column()
    public description? : string;

    @Column()
    public prodImage? : string;

    @Column()
    public price : Number;


    // @ManyToOne(() => Category, (category: Category) => category.name, {
    //     onDelete : 'NO ACTION',
    // })
    // public category : Category;



}
