import {Column, Entity, ManyToOne, OneToMany} from "typeorm";
import {CommonEntity} from "../../common/entities/common.entity";
import {Category} from "../../category/entities/category.entity";
import {Order} from "../../order/entities/order.entity";
import {Member} from "../../members/entities/member.entity";

@Entity()
export class Product extends CommonEntity {

    @Column()
    public name : string;

    @Column()
    public description? : string;

    @Column()
    public prodImage? : string;

    @Column()
    public price : number;


    @ManyToOne(() => Category, (category: Category) => category.name, {
        onDelete : 'NO ACTION',
    })
    public category : Category;

    @ManyToOne(() => Member, (user: Member) => user.products, )
    public user: Member;

    // 주문
    @OneToMany(() => Order, (order: Order) => order.product)
    public orders: Order[];


}
