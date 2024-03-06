import {ConflictException, HttpException, HttpStatus, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Order} from "./entities/order.entity";
import {DataSource, Repository, QueryRunner} from "typeorm";
import {CreateOrderDto} from "./dto/create-order.dto";
import {ProductService} from "../product/product.service";
import {MembersService} from "../members/members.service";
import {POINT_TRANSACTION_STATUS_ENUM} from "./dto/point-transaction-status.enum";
import {Member} from "../members/entities/member.entity";
import {Product} from "../product/entities/product.entity";
import {IPointTransactionCreate} from "./interface/IPointTransactionCreate";
import {OrderResponseDto} from "./dto/order-response.dto";
import {PortoneService} from "../portone/portone.service";



// order.service.ts
@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
        // @InjectRepository(Product)
        // private productRepository: Repository<Product>,

        private readonly productService: ProductService,
        private readonly portoneService: PortoneService,
        private readonly membersService: MembersService,
        private dataSource: DataSource,
    ) {
    }

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

    /** impUid로 결제내역 찾기 */
    async findOneByImpUid({impUid}) {
        return await this.orderRepository.findOne({where: {impUid}});
    }

    /** 중복된 결제인지 확인 */
    async checkTransactionDuplication({impUid}) {
        const result = await this.findOneByImpUid({impUid});
        if (result) throw new ConflictException('이미 등록된 결제 아이디입니다.');
    }


    /**
     * 거래기록 생성 또는 "결제 취소 후 DB에 업데이트"
     * status : 디폴트로 PAYMENT로 설정, 다른 상태값 오면 덮어씀
     * 예 ) cancel 로 넘어오면 status는 cancel 임.
     * */
    async updateOrder({
                          impUid,
                          productId,
                          orderAmount,
                          user: _user,
                          status = POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
                      }) {
        // user를 _user로 변경하기
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            //  order 테이블에 거래기록 1줄 생성
            const pointTransaction = {
                impUid,
                productId,
                orderAmount,
                user: _user,
                status,
            };
            const createTransaction = this.orderRepository.create(pointTransaction);
            await queryRunner.manager.save(createTransaction);

            // user 의 point 업데이트
            const updatedUser = await this.membersService.updateUserPoint(pointTransaction.orderAmount, _user.id)
            await queryRunner.manager.save(updatedUser);

            await queryRunner.commitTransaction();

            // 최종결과 브라우저에 돌려주기
            return pointTransaction;
        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    /**
     * 주문을 생성하고 저장하는 메서드.
     */
    async createAndSaveOrder({
                                 impUid,
                                 quantity,
                                 productId,
                                 user: _user,
                                 status = POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
                             }: IPointTransactionCreate): Promise<OrderResponseDto> {

        let queryRunner: QueryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            // 제품 정보 조회
            const product = await this.productService.findOne(productId);

            const pointTransaction = {
                impUid,
                quantity,
                orderAmount: product.price * quantity,
                user: _user,
                status,
                product, // 주문 정보에 제품 객체 할당
            };
            const createTransaction = this.orderRepository.create(pointTransaction);
            await this.orderRepository.save(createTransaction);

            // user 의 point 업데이트
            const updatedUser = await this.membersService.updateUserPoint(pointTransaction.orderAmount, _user.id)
            await queryRunner.manager.save(updatedUser);

            await queryRunner.commitTransaction();

            // 최종결과 브라우저에 돌려주기
            return pointTransaction;
        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }


    }

    async createOrder({impUid, quantity, productId, user}: CreateOrderDto) {
        // 결제완료 상태인지 검증하기
        await this.portoneService.checkPaid({impUid, quantity})
        // 이미 결제됐던 id인지 검증하기
        await this.checkTransactionDuplication({impUid});


        // 주문 생성 및 저장 로직을 별도의 메서드로 분리하여 호출
        return this.createAndSaveOrder({impUid, quantity, productId, user});
    }


    /** 결제내역 조회  */
    async findByImpUidAndUser({impUid, user}) {
        return await this.orderRepository.find({
            where: {impUid, user: {id: user.id}},
            relations: ['user', 'product'], // user의 포인트 가져오기 위해 join
        })
    }

    /** 결제가 이미 취소됐는지 검증 */
    async checkAlreadyCanceled({pointTransactions}) {
        const canceledPointTransactions = pointTransactions.filter(
            (el) => el.status === POINT_TRANSACTION_STATUS_ENUM.CANCEL,
        );
        if (canceledPointTransactions.length) {
            throw new HttpException('이미 취소된 결제입니다.', HttpStatus.CONFLICT);
        }
    }

    /** 포인트가 충분히 있는지 검증
     * 유저가 취소를 요청했을때 취소 가능한지 검증
     * paidPointTransactions[0].user.point : 결제한 내역의 유저 포인트, 유저가 결제한 포인트 (취소하려는 포인트)
     * paidPointTransactions[0].orderAmount : 결제한 포인트
     * */
    async checkCancelablePoint({pointTransactions}) {
        const paidPointTransactions = pointTransactions.filter(
            (el) => el.status === POINT_TRANSACTION_STATUS_ENUM.PAYMENT,
        );
        if (!paidPointTransactions.length) {
            throw new HttpException(
                '결제 기록이 존재하지 않습니다.',
                HttpStatus.UNPROCESSABLE_ENTITY,
            );
        }

        if (
            paidPointTransactions[0].user.point < paidPointTransactions[0].orderAmount
        ) {
            throw new HttpException(
                '포인트가 부족합니다.',
                HttpStatus.UNPROCESSABLE_ENTITY,
            );
        }
    }


    /** 결제 취소하기 */
    async cancelOrder({impUid, user}): Promise<OrderResponseDto> {
        // 1. 결제내역 조회하기
        const pointTransactions = await this.findByImpUidAndUser({impUid, user})
        console.log('[pointTransactions] : ', pointTransactions)
        console.log('[pointTransactions[0].product]', pointTransactions[0].product.id)
        const productId = pointTransactions[0].product.id;
        // 2. 이미 취소된 id인지 검증, filter : 배열로 담김
        await this.checkAlreadyCanceled({pointTransactions});

        // 3. 포인트가 충분히 있는지 검증
        await this.checkCancelablePoint({pointTransactions});

        // 결제 취소하기
        const canceledAmount = await this.portoneService.cancel({impUid});

        // 취소된 결과 DB에 등록하기
        // -로 차감, create 함수에서 -로 차감됨
        return await this.updateOrder({
            impUid,
            productId,
            orderAmount: -Math.abs(canceledAmount),
            user,
            status: POINT_TRANSACTION_STATUS_ENUM.CANCEL,
        });

    }


    async viewAllPaymentHistory(userId: string) {
        const user = await this.membersService.getUserById(userId)

        return await this.orderRepository.find({
            relations: ['user']
        })


    }



}

