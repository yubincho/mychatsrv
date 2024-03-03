import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Product} from "./entities/product.entity";
import {Repository} from "typeorm";
import {CreateProductDto} from "./dto/create-product.dto";
import {CategoryService} from "../category/category.service";
import {Member} from "../members/entities/member.entity";
import {use} from "passport";

@Injectable()
export class ProductService {

  constructor(
      @InjectRepository(Product)
      private readonly productRepository: Repository<Product>,

      private readonly categoryService: CategoryService,
  ) {}


    async create(dto: CreateProductDto, user: Member): Promise<Product> {
        const { categoryId, ...productDetails } = dto;

        const category = await this.categoryService.getByIdOfCategory(categoryId)

        const newProduct = this.productRepository.create({
                category,
                ...productDetails,
            user: user,
        })
        await this.productRepository.save(newProduct)
        return newProduct
    }

    async getAll() {
      return await this.productRepository.find({
          relations: ['category', 'user',],
      });
    }


    // async findOne(id: string) {
    //   const product = await this.productRepository.findOne({
    //       where: { id },
    //       relations: ['user', 'category',],
    //   })
    //   if (!product) throw new HttpException('No Product found', HttpStatus.NOT_FOUND)
    //     return product
    // }
    async findOne(id: string) {
      const product = await this.productRepository
          .createQueryBuilder('product')
          .where('product.id = :id', { id })
          .leftJoinAndSelect('product.user', 'user')
          .leftJoinAndSelect('product.category', 'category')
          .leftJoinAndSelect('user.orders', 'orders')
          .getOne();
      if (product) return product;
      throw new HttpException('No Product found', HttpStatus.NOT_FOUND);
    }



}
