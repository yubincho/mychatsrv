import {Body, Controller, Post, Req, UseInterceptors} from '@nestjs/common';
import { OrderService } from './order.service';
import {CreateOrderDto} from "./dto/create-order.dto";
import {CustomAuthInterceptor} from "../common/interceptor/CustomAuthInterceptor";
import {RequestWithUserInterface} from "../auth/interfaces/requestWithUser.interface";

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}


  @UseInterceptors(CustomAuthInterceptor)
  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto, @Req() req: RequestWithUserInterface) {
    const userId  = req.user.id
    return this.orderService.createOrder(createOrderDto, userId);
  }
}
