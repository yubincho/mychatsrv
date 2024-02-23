import {Column, Entity, OneToMany} from "typeorm";
import {CommonEntity} from "../../common/entities/common.entity";
import {Product} from "../../product/entities/product.entity";

@Entity()
export class Category extends CommonEntity {

    @Column()
    public name: string;

    @Column()
    public desc: string;

    @Column({ nullable: true })
    public brandImg?: string;

    @Column({ default: false })
    public isDeleted: boolean;

    // @OneToMany(() => Product, (product: Product) => product.category)
    // public products: Product[];

}
