import {Body, Controller, Get, Param, Post, Req, UseGuards, UseInterceptors} from '@nestjs/common';
import { OrderService } from './order.service';
import {CreateOrderDto} from "./dto/create-order.dto";
import {CustomAuthInterceptor} from "../common/interceptor/CustomAuthInterceptor";
import {RequestWithUserInterface} from "../auth/interfaces/requestWithUser.interface";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}


  /**
   * 결제하기
   * 단건
   * */
  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrder(@Body() requestBody: CreateOrderDto, @Req() req: RequestWithUserInterface) {
    const { impUid, quantity, productId } = requestBody;
    const user = req.user;
    return await this.orderService.createOrder({ impUid, quantity, productId, user });
  }


  /**
   * 결제 취소하기
   * 단건
   * */
  @UseGuards(JwtAuthGuard)
  @Post('/cancel/:impUid')
  async cancelOrder(@Param('impUid') impUid: string,
                    @Req() req: RequestWithUserInterface,) {
    const user = req.user;
    return await this.orderService.cancelOrder({ impUid, user });
  }


  /**
   * user의 모든 결제내역 조회
   * 결제성공, 취소 모두 포함
   * */
  @UseGuards(JwtAuthGuard)
  @Get('get-all')
  async getAllPayments(@Req() req: RequestWithUserInterface) {
    const user = req.user.id
    return await this.orderService.viewAllPaymentHistory(user);
  }







}
