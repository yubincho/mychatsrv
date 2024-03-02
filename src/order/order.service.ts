import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Order} from "./entities/order.entity";
import {Repository} from "typeorm";
import {CreateOrderDto} from "./dto/create-order.dto";
import {ProductService} from "../product/product.service";
import {MembersService} from "../members/members.service";
import {POINT_TRANSACTION_STATUS_ENUM} from "./dto/point-transaction-status.enum";
import {Member} from "../members/entities/member.entity";
import {Product} from "../product/entities/product.entity";

// order.service.ts
@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        // @InjectRepository(Product)
        // private productRepository: Repository<Product>,

        private readonly productService: ProductService,
        private readonly membersService: MembersService,
    ) {}

    // async createOrder1(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
    //     const product = await this.productService.findOne(createOrderDto.productId);
    //
    //     const user = await this.membersService.getUserById(userId)
    //
    //     const order = new Order();
    //     order.user = userId; // 사용자 ID 설정
    //     order.product = createOrderDto.productId; // 상품 ID 설정
    //     order.quantity = createOrderDto.quantity;
    //     order.orderAmount = product.price * createOrderDto.quantity; // 가격 계산
    //     order.status = POINT_TRANSACTION_STATUS_ENUM.PENDING; // 상태 설정, 예: 대기 중
    //     order.orderDate = new Date();
    //
    //     await this.orderRepository.save(order);
    //     return order;
    // }

    /**
     * 주문을 생성하고 저장하는 private 메서드.
     */
    private async createAndSaveOrder(createOrderDto: CreateOrderDto, user: Member, product: Product): Promise<Order> {
        const order = new Order();
        order.user = user; // User 엔티티 객체 직접 할당
        order.product = product; // Product 엔티티 객체 직접 할당
        order.quantity = createOrderDto.quantity;
        order.orderAmount = Number(product.price) * Number(createOrderDto.quantity); // 가격 계산
        order.status = POINT_TRANSACTION_STATUS_ENUM.PENDING; // 상태 설정, 예: 대기 중
        order.orderDate = new Date();

        await this.orderRepository.save(order);
        return order; // user, product, order 정보 모두 리턴됨
    }

    async createOrder(createOrderDto: CreateOrderDto, userId: string): Promise<Order> {
        const product = await this.productService.findOne(createOrderDto.productId);
        const user = await this.membersService.getUserById(userId);

        // 주문 생성 및 저장 로직을 별도의 메서드로 분리하여 호출
        return this.createAndSaveOrder(createOrderDto, user, product);
    }
}

